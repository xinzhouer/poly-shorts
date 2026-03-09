import * as lark from '@larksuiteoapi/node-sdk';
import { taskService } from '../services/taskService';
import { parseTask } from '../utils/parser';
import { client } from '../services/feishu';

export const messageHandler = async (data: any) => {
  try {
    const message = data.message;
    const senderId = data.sender.sender_id.user_id;
    const chatId = message.chat_id;
    const content = JSON.parse(message.content).text; // Assume text content for now
    const messageId = message.message_id;
    const rootId = message.root_id; // For replies
    const mentions = message.mentions || [];

    // Check if it's a reply to a task
    if (rootId) {
      // It's a reply
      // Check if the root message is a task
      const task = await taskService.findTaskByMessageId(rootId);
      
      if (task) {
        // It's a reply to a task
        if (content.includes('完成') || content.toLowerCase().includes('complete')) {
          // Mark as completed
          // Verify if the sender is the assignee or creator
          if (task.assignee_id === senderId || task.creator_id === senderId) {
            await taskService.updateTaskStatus(task.id, 'completed');
            await client.im.message.reply({
              path: { message_id: messageId },
              data: {
                content: JSON.stringify({
                  text: `✅ 任务 "${task.content}" 已标记为完成！`
                }),
                msg_type: 'text'
              }
            });
          } else {
             await client.im.message.reply({
              path: { message_id: messageId },
              data: {
                content: JSON.stringify({
                  text: `⚠️ 只有任务执行人或创建者可以标记完成。`
                }),
                msg_type: 'text'
              }
            });
          }
          return;
        }
      }
    }

    // It's a new message (potentially a new task)
    // Only process if bot is mentioned (usually filtered by event subscription, but good to check)
    // In this simple bot, we assume all messages to bot are tasks unless specified otherwise
    
    // Parse task details
    const { content: taskContent, deadline, assignees } = parseTask(content, mentions);

    if (assignees.length > 0) {
      // Create a task for each assignee
      for (const assigneeId of assignees) {
        await taskService.createTask({
          content: taskContent,
          creator_id: senderId,
          assignee_id: assigneeId,
          group_id: chatId,
          deadline: deadline ? deadline.toISOString() : undefined,
          status: 'pending',
          message_id: messageId,
          thread_id: rootId
        });
      }

      // Reply with confirmation
      const assigneeNames = assignees.map(id => `<at user_id="${id}"></at>`).join(' ');
      const deadlineText = deadline ? `📅 截止时间: ${deadline.toLocaleString()}` : '无截止时间';
      
      await client.im.message.reply({
        path: { message_id: messageId },
        data: {
          content: JSON.stringify({
            text: `✅ 任务已创建！\n📝 内容: ${taskContent}\n👤 执行人: ${assigneeNames}\n${deadlineText}`
          }),
          msg_type: 'text'
        }
      });
    } else {
      // No assignee found, maybe just chatting or asking for help
      // If user asks for "my tasks"
      if (content.includes('我的任务') || content.includes('未完成')) {
          const tasks = await taskService.findTasksByAssignee(senderId, 'pending');
          
          if (tasks && tasks.length > 0) {
              const taskList = tasks.map((t: any, i: number) => `${i + 1}. ${t.content} ${t.deadline ? `(📅 ${new Date(t.deadline).toLocaleDateString()})` : ''}`).join('\n');
              await client.im.message.reply({
                  path: { message_id: messageId },
                  data: {
                      content: JSON.stringify({
                          text: `📋 你的未完成任务:\n${taskList}`
                      }),
                      msg_type: 'text'
                  }
              });
          } else {
              await client.im.message.reply({
                  path: { message_id: messageId },
                  data: {
                      content: JSON.stringify({
                          text: `🎉 你当前没有未完成的任务！`
                      }),
                      msg_type: 'text'
                  }
              });
          }
      }
    }

  } catch (error) {
    console.error('Error handling message:', error);
  }
};
