import express from 'express';

import bookController from '../controllers/bookController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, bookController.findAll);
router.delete('/:id', authMiddleware, adminMiddleware, bookController.destroy);

export default router;