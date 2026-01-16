import supabase from '../config/supabase.js';

export const todoService = {
  // Get all todos with optional filters
  async getAll(filters = {}) {
    let query = supabase
      .from('todos')
      .select('*')
      .order('due_date', { ascending: true });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get single todo by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new todo
  async create(todoData) {
    const { data, error } = await supabase
      .from('todos')
      .insert([{
        title: todoData.title,
        description: todoData.description || '',
        priority: todoData.priority || 'medium',
        status: todoData.status || 'pending',
        due_date: todoData.due_date,
        user_id: todoData.user_id,
        email: todoData.email,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update todo
  async update(id, updates) {
    const updateData = { ...updates, updated_at: new Date().toISOString() };
    
    // If marking as completed, set completed_at
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete todo
  async delete(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  // Get todos due soon (for notifications)
  async getDueSoon(hoursAhead = 24) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .neq('status', 'completed')
      .gte('due_date', now.toISOString())
      .lte('due_date', futureDate.toISOString())
      .eq('notified', false);

    if (error) throw error;
    return data;
  },

  // Get overdue todos
  async getOverdue() {
    const now = new Date();

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .neq('status', 'completed')
      .lt('due_date', now.toISOString())
      .eq('overdue_notified', false);

    if (error) throw error;
    return data;
  },

  // Mark todo as notified
  async markNotified(id, type = 'upcoming') {
    const field = type === 'overdue' ? 'overdue_notified' : 'notified';
    
    const { error } = await supabase
      .from('todos')
      .update({ [field]: true })
      .eq('id', id);

    if (error) throw error;
  },
};
