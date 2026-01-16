import { userService } from '../services/userService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const userController = {
  // POST /api/users/login - Simple login/register
  login: asyncHandler(async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await userService.createOrGet({ email, name });
    res.json(user);
  }),

  // GET /api/users/:id
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  }),

  // PUT /api/users/:id/preferences
  updatePreferences: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const preferences = req.body;

    const user = await userService.updatePreferences(id, preferences);
    res.json(user);
  }),
};
