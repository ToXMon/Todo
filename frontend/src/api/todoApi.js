const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

function getApiUrl(endpoint) {
  // In development, use relative paths
  // In production, use the full URL if needed
  return `${API_BASE}${endpoint}`;
}

export const todoApi = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const url = getApiUrl(`/todos${params.toString() ? `?${params}` : ''}`);
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      throw new Error('Could not connect to server. Make sure the backend is running.');
    }
  },

  async getById(id) {
    try {
      const response = await fetch(getApiUrl(`/todos/${id}`));
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch todo:', error);
      throw error;
    }
  },

  async create(todoData) {
    try {
      const response = await fetch(getApiUrl('/todos'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw new Error('Could not create todo. Make sure the backend is running.');
    }
  },

  async update(id, updates) {
    try {
      const response = await fetch(getApiUrl(`/todos/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw new Error('Could not update todo. Make sure the backend is running.');
    }
  },

  async delete(id) {
    try {
      const response = await fetch(getApiUrl(`/todos/${id}`), {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw new Error('Could not delete todo. Make sure the backend is running.');
    }
  },
};

export const userApi = {
  async login(email, name) {
    try {
      const response = await fetch(getApiUrl('/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to login:', error);
      throw new Error('Could not connect to server. Make sure the backend is running.');
    }
  },

  async getById(id) {
    try {
      const response = await fetch(getApiUrl(`/users/${id}`));
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  async updatePreferences(id, preferences) {
    try {
      const response = await fetch(getApiUrl(`/users/${id}/preferences`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  },
};
