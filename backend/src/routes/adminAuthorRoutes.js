import express from 'express';

import authorController from '../controllers/authorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import upload from '../middlewares/uploadAuthor.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, authorController.listAuthors);
router.post('/', authMiddleware, adminMiddleware, upload.single('photo'), authorController.createAuthor);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('photo'), authorController.updateAuthor);
router.delete('/:id', authMiddleware, adminMiddleware, authorController.deleteAuthor);

export default router;
