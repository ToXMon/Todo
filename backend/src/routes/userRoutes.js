import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', userController.login);
router.get('/:id', userController.getById);
router.put('/:id/preferences', userController.updatePreferences);

export default router;
