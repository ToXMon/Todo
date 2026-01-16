import { todoService } from '../services/todoService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const todoController = {
  // GET /api/todos
  getAll: asyncHandler(async (req, res) => {
    const { status, priority, user_id } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (user_id) filters.user_id = user_id;

    const todos = await todoService.getAll(filters);
    res.json(todos);
  }),

  // GET /api/todos/:id
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await todoService.getById(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  }),

  // POST /api/todos
  create: asyncHandler(async (req, res) => {
    const { title, description, priority, due_date, user_id, email } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!due_date) {
      return res.status(400).json({ error: 'Due date is required' });
    }

    const todo = await todoService.create({
      title,
      description,
      priority,
      due_date,
      user_id,
      email,
    });

    res.status(201).json(todo);
  }),

  // PUT /api/todos/:id
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const todo = await todoService.update(id, updates);
    res.json(todo);
  }),

  // DELETE /api/todos/:id
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await todoService.delete(id);
    res.json({ message: 'Todo deleted successfully' });
  }),

  // GET /api/todos/due-soon
  getDueSoon: asyncHandler(async (req, res) => {
    const hours = parseInt(req.query.hours) || 24;
    const todos = await todoService.getDueSoon(hours);
    res.json(todos);
  }),

  // GET /api/todos/overdue
  getOverdue: asyncHandler(async (req, res) => {
    const todos = await todoService.getOverdue();
    res.json(todos);
  }),
};
