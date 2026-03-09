import { supabase } from './supabase';

export interface Task {
  id: string;
  content: string;
  creator_id: string;
  assignee_id: string;
  group_id: string;
  deadline?: string;
  status: 'pending' | 'completed' | 'cancelled';
  message_id: string;
  thread_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const taskService = {
  /**
   * Create a new task
   */
  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('feishu_tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data;
  },

  /**
   * Find a task by message ID (root ID)
   */
  async findTaskByMessageId(messageId: string) {
    const { data, error } = await supabase
      .from('feishu_tasks')
      .select('*')
      .eq('message_id', messageId)
      .single();

    if (error) {
        // If not found, it might be okay (not a task message)
        return null;
    }
    return data;
  },
  
  /**
   * Find tasks by assignee
   */
  async findTasksByAssignee(assigneeId: string, status: 'pending' | 'completed' | 'cancelled' = 'pending') {
      const { data, error } = await supabase
        .from('feishu_tasks')
        .select('*')
        .eq('assignee_id', assigneeId)
        .eq('status', status);
        
      if (error) {
          console.error('Error finding tasks by assignee:', error);
          throw error;
      }
      return data;
  },

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: string, status: 'completed' | 'cancelled') {
    const { data, error } = await supabase
      .from('feishu_tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task status:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get weekly report for a group
   */
  async getWeeklyReport(groupId: string, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('feishu_tasks')
      .select('*')
      .eq('group_id', groupId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) {
      console.error('Error getting weekly report:', error);
      throw error;
    }

    return data;
  }
};
