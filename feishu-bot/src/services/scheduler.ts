import cron from 'node-cron';
import { taskService } from './taskService';
import { client } from './feishu';
import { supabase } from './supabase';

export const startScheduler = () => {
  console.log('Starting scheduler...');

  // Weekly Report: Every Monday at 10:00 AM
  cron.schedule('0 10 * * 1', async () => {
    console.log('Running weekly report job...');
    try {
      // Get all unique group IDs from tasks created in the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data: groups, error } = await supabase
        .from('feishu_tasks')
        .select('group_id')
        .gte('created_at', oneWeekAgo.toISOString())
        // distinct group_id query might need raw SQL or specific Supabase function, 
        // for now just get all and filter in memory for simplicity
      
      if (error) throw error;
      
      const uniqueGroupIds = [...new Set(groups.map(g => g.group_id))];

      for (const groupId of uniqueGroupIds) {
        const tasks = await taskService.getWeeklyReport(groupId, oneWeekAgo, new Date());
        
        if (!tasks || tasks.length === 0) continue;

        const completedTasks = tasks.filter(t => t.status === 'completed');
        const pendingTasks = tasks.filter(t => t.status === 'pending');

        const report = `📊 **上周任务周报**\n` +
          `✅ 已完成: ${completedTasks.length}\n` +
          `md pending: ${pendingTasks.length}\n\n` +
          `**未完成任务:**\n` +
          pendingTasks.map(t => `- ${t.content} (@${t.assignee_id})`).join('\n');

        await client.im.message.create({
          params: { receive_id_type: 'chat_id' },
          data: {
            receive_id: groupId,
            content: JSON.stringify({ text: report }),
            msg_type: 'text'
          }
        });
      }
    } catch (error) {
      console.error('Error running weekly report job:', error);
    }
  });

  // Check for overdue tasks every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Checking for overdue tasks...');
    // Implementation for overdue checks would go here
    // Logic: Find pending tasks where deadline < now AND no reminder sent recently
  });

  // Check for 3-hour no-response reminders every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Checking for 3-hour no-response tasks...');
    // Implementation for 3-hour reminders would go here
  });
};
