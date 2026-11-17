import express from 'express';
import bookController from '../controllers/bookController.js';
import upload from '../middlewares/uploadBook.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', bookController.findAll);
router.get('/banners', bookController.listBanners);
router.get('/ebooks', bookController.listEbooks);
router.get('/categories', bookController.listPublicCategories);
router.get('/testimonials', bookController.listPublicTestimonials);
router.post('/testimonials', authMiddleware, bookController.createTestimonial);
router.get('/best-sellers', bookController.listBestSellers);
router.get('/:id', bookController.findById);

// Rotas autenticadas (admin)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), bookController.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), bookController.update);
router.delete('/:id', authMiddleware, adminMiddleware, bookController.remove);

export default router;
