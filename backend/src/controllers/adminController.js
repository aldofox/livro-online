import pool from '../config/db.js';

class AdminController {

    async dashboard(
        req,
        res
    ) {

        try {

            const [[customers]] =
                await pool.query(
                    `
                    SELECT
                        COUNT(*) total
                    FROM customers
                    `
                );

            const [[books]] =
                await pool.query(
                    `
                    SELECT
                        COUNT(*) total
                    FROM books
                    `
                );

            const [[orders]] =
                await pool.query(
                    `
                    SELECT
                        COUNT(*) total
                    FROM orders
                    `
                );

            const [[revenue]] =
                await pool.query(
                    `
                    SELECT
                        COALESCE(
                            SUM(total),
                            0
                        ) total
                    FROM orders
                    `
                );

            const [recentOrders] =
                await pool.query(
                    `
                    SELECT
                        o.id,
                        o.total,
                        o.created_at,
                        c.name
                    FROM orders o
                    INNER JOIN customers c
                        ON c.id =
                        o.customer_id
                    ORDER BY o.id DESC
                    LIMIT 5
                    `
                );

            return res.json({

                success: true,

                stats: {

                    customers:
                        customers.total,

                    books:
                        books.total,

                    orders:
                        orders.total,

                    revenue:
                        revenue.total

                },

                recentOrders

            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({

                success: false,

                message:
                    'Erro dashboard'

            });

        }

    }

    // =========================================================
    // CATEGORIAS
    // =========================================================

    async listCategories(req, res) {

        try {

            const [categories] =
                await pool.query(
                    `
                    SELECT
                        c.*,
                        COUNT(b.id) AS book_count
                    FROM categories c
                    LEFT JOIN books b
                        ON b.category_id = c.id
                    GROUP BY c.id
                    ORDER BY c.name ASC
                    `
                );

            return res.json({
                success: true,
                categories
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar categorias'
            });

        }

    }

    async createCategory(req, res) {

        try {

            const { name, slug, image } = req.body;

            if (!name) {

                return res.status(400).json({
                    success: false,
                    message: 'Nome da categoria é obrigatório'
                });

            }

            const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const [result] = await pool.query(
                `
                INSERT INTO categories (name, slug, image)
                VALUES (?, ?, ?)
                `,
                [name, finalSlug, image || null]
            );

            return res.status(201).json({
                success: true,
                message: 'Categoria criada com sucesso',
                id: result.insertId
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao criar categoria'
            });

        }

    }

    async updateCategory(req, res) {

        try {

            const { id } = req.params;
            const { name, slug, image } = req.body;

            if (!name) {

                return res.status(400).json({
                    success: false,
                    message: 'Nome da categoria é obrigatório'
                });

            }

            const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            await pool.query(
                `
                UPDATE categories
                SET name = ?, slug = ?, image = ?
                WHERE id = ?
                `,
                [name, finalSlug, image || null, id]
            );

            return res.json({
                success: true,
                message: 'Categoria atualizada com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar categoria'
            });

        }

    }

    async deleteCategory(req, res) {

        try {

            const { id } = req.params;

            await pool.query(
                `
                DELETE FROM categories
                WHERE id = ?
                `,
                [id]
            );

            return res.json({
                success: true,
                message: 'Categoria excluída com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao excluir categoria'
            });

        }

    }

    // =========================================================
    // PEDIDOS (ADMIN)
    // =========================================================

    async listOrders(req, res) {

        try {

            const [orders] =
                await pool.query(
                    `
                    SELECT
                        o.id,
                        o.total,
                        o.payment_method,
                        o.payment_status,
                        o.order_status,
                        o.installments,
                        o.created_at,
                        c.name AS customer_name,
                        c.email AS customer_email
                    FROM orders o
                    INNER JOIN customers c
                        ON c.id = o.customer_id
                    ORDER BY o.id DESC
                    `
                );

            return res.json({
                success: true,
                orders
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar pedidos'
            });

        }

    }

    async updateOrderStatus(req, res) {

        try {

            const { id } = req.params;
            const { order_status } = req.body;

            const validStatuses = [
                'waiting_payment',
                'processing',
                'pending',
                'paid',
                'shipped',
                'sent',
                'delivered',
                'cancelled'
            ];

            if (!validStatuses.includes(order_status)) {

                return res.status(400).json({
                    success: false,
                    message: 'Status inválido'
                });

            }

            await pool.query(
                `
                UPDATE orders
                SET order_status = ?
                WHERE id = ?
                `,
                [order_status, id]
            );

            return res.json({
                success: true,
                message: 'Status do pedido atualizado'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar status do pedido'
            });

        }

    }

    // =========================================================
    // CLIENTES (ADMIN)
    // =========================================================

    async listCustomers(req, res) {

        try {

            const [customers] =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        email,
                        phone,
                        cpf,
                        status,
                        role,
                        created_at,
                        (SELECT COUNT(*) FROM orders o WHERE o.customer_id = customers.id) AS total_orders
                    FROM customers
                    ORDER BY id DESC
                    `
                );

            return res.json({
                success: true,
                customers
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar clientes'
            });

        }

    }

    // =========================================================
    // COMENTÁRIOS / DEPOIMENTOS (ADMIN)
    // =========================================================

    async listTestimonials(req, res) {

        try {

            const [testimonials] =
                await pool.query(
                    `
                    SELECT
                        t.id,
                        t.message,
                        t.rating,
                        t.status,
                        t.created_at,
                        c.name AS customer_name,
                        c.email AS customer_email
                    FROM testimonials t
                    LEFT JOIN customers c
                        ON c.id = t.customer_id
                    ORDER BY t.id DESC
                    `
                );

            return res.json({
                success: true,
                testimonials
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar comentários'
            });

        }

    }

async updateTestimonialStatus(req, res) {

        try {

            const { id } = req.params;
            const { status } = req.body;

            if (!['approved', 'pending', 'rejected'].includes(status)) {

                return res.status(400).json({
                    success: false,
                    message: 'Status inválido'
                });

            }

            await pool.query(
                `
                UPDATE testimonials
                SET status = ?
                WHERE id = ?
                `,
                [status, id]
            );

            return res.json({
                success: true,
                message: 'Status do comentário atualizado'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar status do comentário'
            });

        }

    }

    // =========================================================
    // BANNERS (ADMIN)
    // =========================================================

    async listBanners(req, res) {

        try {

            const [banners] =
                await pool.query(
                    `
                    SELECT
                        b.id,
                        b.title,
                        b.subtitle,
                        b.description,
                        b.button_text,
                        b.button_link,
                        b.image,
                        b.type,
                        b.reference_id,
                        b.status,
                        b.created_at,
                        bk.title AS book_title,
                        bk.image AS book_image,
                        bk.price AS book_price,
                        bk.author AS book_author
                    FROM banners b
                    LEFT JOIN books bk
                        ON bk.id = b.reference_id
                    ORDER BY b.id DESC
                    `
                );

            return res.json({
                success: true,
                banners
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar banners'
            });

        }

    }

    async createBanner(req, res) {

        try {

            const {
                reference_id,
                title,
                subtitle,
                description,
                button_text,
                status
            } = req.body;

            if (!reference_id) {

                return res.status(400).json({
                    success: false,
                    message: 'Selecione um livro para o banner'
                });

            }

            // Garante que o livro existe
            const [[book]] = await pool.query(
                `
                SELECT id, title, image
                FROM books
                WHERE id = ?
                `,
                [reference_id]
            );

            if (!book) {

                return res.status(400).json({
                    success: false,
                    message: 'Livro não encontrado'
                });

            }

            // Usa os dados do livro como padrão do banner
            const finalTitle = title || book.title;
            const finalImage = book.image;

            await pool.query(
                `
                INSERT INTO banners
                (title, subtitle, description, button_text, button_link,
                 image, type, reference_id, status)
                VALUES (?, ?, ?, ?, ?, ?, 'book', ?, ?)
                `,
                [
                    finalTitle,
                    subtitle || null,
                    description || null,
                    button_text || 'Ver Detalhes',
                    `/book/${reference_id}`,
                    finalImage,
                    reference_id,
                    status || 'active'
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Banner criado com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao criar banner'
            });

        }

    }

    async updateBanner(req, res) {

        try {

            const { id } = req.params;
            const {
                reference_id,
                title,
                subtitle,
                description,
                button_text,
                status
            } = req.body;

            const [banners] = await pool.query(
                `
                SELECT * FROM banners
                WHERE id = ?
                `,
                [id]
            );

            if (banners.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: 'Banner não encontrado'
                });

            }

            const current = banners[0];

            const clean = (value, fallback) =>
                value === '' || value === null ||
                value === undefined || value === 'null'
                    ? fallback
                    : value;

            // Se mudou o livro, atualiza os dados padrão
            let finalTitle = clean(title, current.title);
            let finalImage = current.image;
            let finalButtonLink = current.button_link;

            if (reference_id && reference_id !== current.reference_id) {

                const [[book]] = await pool.query(
                    `
                    SELECT id, title, image
                    FROM books
                    WHERE id = ?
                    `,
                    [reference_id]
                );

                if (book) {

                    finalImage = book.image;
                    finalButtonLink = `/book/${book.id}`;
                    if (!title) finalTitle = book.title;

                }

            }

            await pool.query(
                `
                UPDATE banners
                SET reference_id = ?,
                    title = ?,
                    subtitle = ?,
                    description = ?,
                    button_text = ?,
                    button_link = ?,
                    image = ?,
                    status = ?
                WHERE id = ?
                `,
                [
                    reference_id || current.reference_id,
                    finalTitle,
                    clean(subtitle, current.subtitle),
                    clean(description, current.description),
                    clean(button_text, current.button_text),
                    finalButtonLink,
                    finalImage,
                    clean(status, current.status),
                    id
                ]
            );

            return res.json({
                success: true,
                message: 'Banner atualizado com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar banner'
            });

        }

    }

    async deleteBanner(req, res) {

        try {

            const { id } = req.params;

            await pool.query(
                `
                DELETE FROM banners
                WHERE id = ?
                `,
                [id]
            );

            return res.json({
                success: true,
                message: 'Banner excluído com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao excluir banner'
            });

        }

    }

}

export default new AdminController();

