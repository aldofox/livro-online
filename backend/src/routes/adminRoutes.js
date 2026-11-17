import express from 'express';

import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, adminController.dashboard);

// Categorias
router.get('/categories', authMiddleware, adminMiddleware, adminController.listCategories);
router.post('/categories', authMiddleware, adminMiddleware, adminController.createCategory);
router.put('/categories/:id', authMiddleware, adminMiddleware, adminController.updateCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, adminController.deleteCategory);

// Pedidos (admin)
router.get('/orders', authMiddleware, adminMiddleware, adminController.listOrders);
router.put('/orders/:id/status', authMiddleware, adminMiddleware, adminController.updateOrderStatus);

// Clientes (admin)
router.get('/customers', authMiddleware, adminMiddleware, adminController.listCustomers);

// Comentários / Depoimentos
router.get('/testimonials', authMiddleware, adminMiddleware, adminController.listTestimonials);
router.put('/testimonials/:id/status', authMiddleware, adminMiddleware, adminController.updateTestimonialStatus);

// Banners
router.get('/banners', authMiddleware, adminMiddleware, adminController.listBanners);
router.post('/banners', authMiddleware, adminMiddleware, adminController.createBanner);
router.put('/banners/:id', authMiddleware, adminMiddleware, adminController.updateBanner);
router.delete('/banners/:id', authMiddleware, adminMiddleware, adminController.deleteBanner);

export default router;

