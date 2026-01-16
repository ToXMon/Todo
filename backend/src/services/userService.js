import supabase from '../config/supabase.js';

export const userService = {
  // Get user by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get user by email
  async getByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create or get user (simple auth for demo)
  async createOrGet(userData) {
    // Check if user exists
    const existing = await this.getByEmail(userData.email);
    if (existing) return existing;

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        notifications_enabled: true,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user preferences
  async updatePreferences(id, preferences) {
    const { data, error } = await supabase
      .from('users')
      .update({
        notifications_enabled: preferences.notifications_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
