import express from 'express';

import authorController from '../controllers/authorController.js';

const router = express.Router();

// Rotas públicas
router.get('/', authorController.listPublicAuthors);

export default router;
