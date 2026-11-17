import express from 'express';

import addressController
from '../controllers/addressController.js';

import authMiddleware
from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    addressController.findAll
);

router.post(
    '/',
    authMiddleware,
    addressController.create
);

router.delete(
    '/:id',
    authMiddleware,
    addressController.delete
);

export default router;