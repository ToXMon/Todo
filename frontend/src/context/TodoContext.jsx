import { createContext, useContext, useReducer, useEffect } from 'react';
import { todoApi, userApi } from '../api/todoApi';

const TodoContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SET_USER: 'SET_USER',
  SET_FILTER: 'SET_FILTER',
  LOGOUT: 'LOGOUT',
};

// Initial state
const initialState = {
  todos: [],
  user: null,
  loading: false,
  error: null,
  filter: {
    status: 'all',
    priority: 'all',
    sortBy: 'due_date',
  },
};

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_TODOS:
      return { ...state, todos: action.payload, loading: false };
    
    case ACTIONS.ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] };
    
    case ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    
    case ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTIONS.SET_FILTER:
      return { ...state, filter: { ...state.filter, ...action.payload } };
    
    case ACTIONS.LOGOUT:
      return { ...initialState };
    
    default:
      return state;
  }
}

// Provider
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('todoUser');
    if (savedUser) {
      dispatch({ type: ACTIONS.SET_USER, payload: JSON.parse(savedUser) });
    }
  }, []);

  // Fetch todos when user logs in
  useEffect(() => {
    if (state.user) {
      fetchTodos();
    }
  }, [state.user]);

  // API Actions
  const fetchTodos = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const todos = await todoApi.getAll();
      dispatch({ type: ACTIONS.SET_TODOS, payload: todos });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const addTodo = async (todoData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const newTodo = await todoApi.create({
        ...todoData,
        user_id: state.user.id,
        email: state.user.email,
      });
      dispatch({ type: ACTIONS.ADD_TODO, payload: newTodo });
      return newTodo;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const updatedTodo = await todoApi.update(id, updates);
      dispatch({ type: ACTIONS.UPDATE_TODO, payload: updatedTodo });
      return updatedTodo;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoApi.delete(id);
      dispatch({ type: ACTIONS.DELETE_TODO, payload: id });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const login = async (email, name) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const user = await userApi.login(email, name);
      localStorage.setItem('todoUser', JSON.stringify(user));
      dispatch({ type: ACTIONS.SET_USER, payload: user });
      return user;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('todoUser');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  const setFilter = (filter) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filter });
  };

  // Get filtered and sorted todos
  const getFilteredTodos = () => {
    let filtered = [...state.todos];

    // Filter by status
    if (state.filter.status !== 'all') {
      filtered = filtered.filter(todo => todo.status === state.filter.status);
    }

    // Filter by priority
    if (state.filter.priority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === state.filter.priority);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (state.filter.sortBy) {
        case 'due_date':
          return new Date(a.due_date) - new Date(b.due_date);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const value = {
    ...state,
    filteredTodos: getFilteredTodos(),
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    login,
    logout,
    setFilter,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
