import pool from '../config/db.js';

class BookController {

    async create(req, res) {

        console.log('HEADERS');
        console.log(req.headers);
        console.log('BODY RECEBIDO');
        console.log(req.body);
        console.log('FILE RECEBIDO');
        console.log(req.file);

        try {

            const {
                category_id,
                title,
                author,
                publisher,
                isbn,
                pages,
                language,
                publication_date,
                description_short,
                description_long,
                price,
                promotional_price,
                stock,
                featured,
                release_book,
                status
            } = req.body;

            const image = req.file
                ? req.file.filename
                : null;

            // Normaliza campos vazios e a string "null" para null
            const clean = (value) =>
                value === '' || value === null ||
                value === undefined || value === 'null'
                    ? null
                    : value;

            const [result] = await pool.query(
                `
                INSERT INTO books
                (
                    category_id,
                    title,
                    author,
                    publisher,
                    isbn,
                    pages,
                    language,
                    publication_date,
                    description_short,
                    description_long,
                    price,
                    promotional_price,
                    stock,
                    image,
                    featured,
                    release_book,
                    status
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    clean(category_id),
                    title,
                    author,
                    clean(publisher),
                    clean(isbn),
                    clean(pages),
                    clean(language),
                    clean(publication_date),
                    clean(description_short),
                    clean(description_long),
                    price,
                    clean(promotional_price),
                    clean(stock),
                    image,
                    clean(featured),
                    clean(release_book),
                    clean(status)
                ]
            );

            res.status(201).json({
                success: true,
                message: 'Livro cadastrado com sucesso',
                id: result.insertId
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async findAll(req, res) {

        try {

            const [books] = await pool.query(`
                SELECT *
                FROM books
                ORDER BY id DESC
            `);

            res.json({
                success: true,
                books
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async findById(req, res) {

        try {

            const { id } = req.params;

            const [books] = await pool.query(
                `
                SELECT *
                FROM books
                WHERE id = ?
                `,
                [id]
            );

            if (books.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: 'Livro não encontrado'
                });

            }

            res.json({
                success: true,
                book: books[0]
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async update(req, res) {

    try {

        const { id } = req.params;

        const {
            category_id,
            title,
            author,
            publisher,
            isbn,
            pages,
            language,
            publication_date,
            description_short,
            description_long,
            price,
            promotional_price,
            stock,
            featured,
            release_book,
            status
        } = req.body;

        // Busca o livro atual
        const [books] = await pool.query(
            `
            SELECT *
            FROM books
            WHERE id = ?
            `,
            [id]
        );

        if (books.length === 0) {

            return res.status(404).json({
                success: false,
                message: 'Livro não encontrado'
            });

        }

const currentBook = books[0];

        // Normaliza campos vazios e a string "null" para null
        const clean = (value) =>
            value === '' || value === null ||
            value === undefined || value === 'null'
                ? null
                : value;

        // Mantém a imagem existente caso nenhuma nova seja enviada
        const image = req.file
            ? req.file.filename
            : currentBook.image;

        await pool.query(
            `
            UPDATE books
            SET
                category_id = ?,
                title = ?,
                author = ?,
                publisher = ?,
                isbn = ?,
                pages = ?,
                language = ?,
                publication_date = ?,
                description_short = ?,
                description_long = ?,
                price = ?,
                promotional_price = ?,
                stock = ?,
                image = ?,
                featured = ?,
                release_book = ?,
                status = ?
            WHERE id = ?
            `,
[
                clean(category_id),
                clean(title),
                clean(author),
                clean(publisher),
                clean(isbn),
                clean(pages),
                clean(language),
                clean(publication_date),
                clean(description_short),
                clean(description_long),
                clean(price),
                clean(promotional_price),
                clean(stock),
                clean(image),
                clean(featured),
                clean(release_book),
                clean(status),
                id
            ]
        );

        return res.json({
            success: true,
            message: 'Livro atualizado com sucesso'
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

    }

    async remove(req, res) {

    try {

        const { id } = req.params;

        const [books] =
            await pool.query(
                `
                SELECT *
                FROM books
                WHERE id = ?
                `,
                [id]
            );

        if (books.length === 0) {

            return res.status(404).json({

                success: false,
                message: 'Livro não encontrado'

            });

        }

        await pool.query(
            `
            DELETE FROM books
            WHERE id = ?
            `,
            [id]
        );

        return res.json({

            success: true,
            message: 'Livro excluído com sucesso'

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

    }

    async index(req, res) {

    try {

        const [books] = await pool.query(`
            SELECT
                b.*,
                c.name AS category_name
            FROM books b
            LEFT JOIN categories c
                ON c.id = b.category_id
            ORDER BY b.id DESC
        `);

        return res.json({
            success: true,
            books
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Erro ao listar livros'
        });

    }

    }

async destroy(req, res) {

    try {

        const { id } = req.params;

        await pool.query(
            `
            DELETE FROM books
            WHERE id = ?
            `,
            [id]
        );

        return res.json({
            success: true,
            message: 'Livro removido com sucesso'
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Erro ao remover livro'
        });

    }

    }

    // =========================================================
    // E-BOOKS (público)
    // =========================================================

    async listEbooks(req, res) {

        try {

            const [ebooks] =
                await pool.query(
                    `
                    SELECT
                        e.*,
                        c.name AS category_name
                    FROM ebooks e
                    LEFT JOIN categories c
                        ON c.id = e.category_id
                    WHERE e.status = 'active'
                    ORDER BY e.id DESC
                    `
                );

            return res.json({
                success: true,
                ebooks
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar e-books'
            });

        }

    }

    // =========================================================
    // BANNERS (público)
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
                        b.reference_id,
                        b.created_at,
                        bk.title AS book_title,
                        bk.image AS book_image,
                        bk.price AS book_price,
                        bk.author AS book_author
                    FROM banners b
                    LEFT JOIN books bk
                        ON bk.id = b.reference_id
                    WHERE b.status = 'active'
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

    // =========================================================
    // DEPOIMENTOS (público)
    // =========================================================

    async listPublicTestimonials(req, res) {

        try {

            const [testimonials] =
                await pool.query(
                    `
                    SELECT
                        t.id,
                        t.message,
                        t.rating,
                        t.created_at,
                        c.name AS customer_name,
                        c.image AS customer_image
                    FROM testimonials t
                    LEFT JOIN customers c
                        ON c.id = t.customer_id
                    WHERE t.status = 'approved'
                    ORDER BY t.id DESC
                    LIMIT 6
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
                message: 'Erro ao listar depoimentos'
            });

        }

    }

    // =========================================================
    // ENVIAR DEPOIMENTO (público - cliente logado)
    // =========================================================

    async createTestimonial(req, res) {

        try {

            const { message, rating } = req.body;

            if (!message) {

                return res.status(400).json({
                    success: false,
                    message: 'Preencha o comentário'
                });

            }

            const customerId = req.user.id;

            const ratingValue = Math.max(
                1,
                Math.min(5, parseInt(rating, 10) || 5)
            );

            await pool.query(
                `
                INSERT INTO testimonials
                (customer_id, message, rating, status)
                VALUES (?, ?, ?, 'pending')
                `,
                [
                    customerId,
                    message,
                    ratingValue
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Comentário enviado com sucesso! Aguardando aprovação.'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar comentário'
            });

        }

    }

    // =========================================================
    // CATEGORIAS (público)
    // =========================================================

async listPublicCategories(req, res) {

        try {

            const [categories] =
                await pool.query(
                    `
                    SELECT
                        c.id,
                        c.name,
                        c.slug,
                        c.image,
                        COUNT(b.id) AS book_count
                    FROM categories c
                    LEFT JOIN books b
                        ON b.category_id = c.id
                        AND b.status = 'active'
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

    // =========================================================
    // LIVROS MAIS VENDIDOS (público)
    // =========================================================

    async listBestSellers(req, res) {

        try {

            const [bestSellers] =
                await pool.query(
                    `
                    SELECT
                        b.*,
                        c.name AS category_name,
                        COALESCE(SUM(oi.quantity), 0) AS total_vendas
                    FROM books b
                    LEFT JOIN categories c
                        ON c.id = b.category_id
                    LEFT JOIN order_items oi
                        ON oi.book_id = b.id
                    LEFT JOIN orders o
                        ON o.id = oi.order_id
                        AND o.order_status NOT IN ('cancelled', 'waiting_payment')
                    WHERE b.status = 'active'
                    GROUP BY b.id
                    HAVING total_vendas > 5
                    ORDER BY total_vendas DESC
                    `
                );

            return res.json({
                success: true,
                bestSellers
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar livros mais vendidos'
            });

        }

    }

}

export default new BookController();
