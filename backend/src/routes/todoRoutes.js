import express from 'express';
import { todoController } from '../controllers/todoController.js';

const router = express.Router();

// Special routes first
router.get('/due-soon', todoController.getDueSoon);
router.get('/overdue', todoController.getOverdue);

// CRUD routes
router.get('/', todoController.getAll);
router.get('/:id', todoController.getById);
router.post('/', todoController.create);
router.put('/:id', todoController.update);
router.delete('/:id', todoController.delete);

export default router;
