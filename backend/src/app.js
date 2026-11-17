    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';

    import pool from './config/db.js';

import authRoutes from './routes/authRoutes.js';
    import bookRoutes from './routes/bookRoutes.js';
    import addressRoutes from './routes/addressRoutes.js';
    import orderRoutes from './routes/orderRoutes.js';
    import adminRoutes from './routes/adminRoutes.js';
import adminBookRoutes from './routes/adminBookRoutes.js';
import adminAuthorRoutes from './routes/adminAuthorRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
    import contactRoutes from './routes/contactRoutes.js';
    import bookController from './controllers/bookController.js';

    dotenv.config();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/addresses',addressRoutes);
    app.use('/api/orders', orderRoutes);
app.use('/api/admin',adminRoutes);
    app.use('/api/admin/books', adminBookRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/authors', authorRoutes);
    app.use('/api/admin/authors', adminAuthorRoutes);

    // Rota pública de banners (para o frontend chamar /banners)
    app.get('/api/banners', bookController.listBanners);
    

    app.get('/', async (req, res) => {

        try {

            const [rows] = await pool.query('SELECT 1');

            res.json({
                success: true,
                message: 'API BookStore funcionando!',
                database: 'MySQL conectado com sucesso'
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: 'Erro ao conectar no banco'
            });

        }

    });

    export default app;