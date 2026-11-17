import pool from '../config/db.js';

class AuthorController {

    // =========================================================
    // LISTAR AUTORES (admin)
    // =========================================================

    async listAuthors(req, res) {

        try {

            const [authors] =
                await pool.query(
                    `
                    SELECT
                        a.*,
                        c.name AS category_name
                    FROM authors a
                    LEFT JOIN categories c
                        ON c.id = a.category_id
                    ORDER BY a.id DESC
                    `
                );

            return res.json({
                success: true,
                authors
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar autores'
            });

        }

    }

    // =========================================================
    // CRIAR AUTOR
    // =========================================================

    async createAuthor(req, res) {

        try {

            const {
                name,
                bio,
                category_id,
                status
            } = req.body;

            if (!name) {

                return res.status(400).json({
                    success: false,
                    message: 'Nome do autor é obrigatório'
                });

            }

            const photo = req.file
                ? req.file.filename
                : null;

            const [result] = await pool.query(
                `
                INSERT INTO authors
                (name, bio, photo, category_id, status)
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    name,
                    bio || null,
                    photo,
                    category_id || null,
                    status || 'active'
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Autor criado com sucesso',
                id: result.insertId
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao criar autor'
            });

        }

    }

    // =========================================================
    // ATUALIZAR AUTOR
    // =========================================================

    async updateAuthor(req, res) {

        try {

            const { id } = req.params;
            const {
                name,
                bio,
                category_id,
                status
            } = req.body;

            const [authors] = await pool.query(
                `
                SELECT * FROM authors
                WHERE id = ?
                `,
                [id]
            );

            if (authors.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: 'Autor não encontrado'
                });

            }

            const current = authors[0];

            const clean = (value, fallback) =>
                value === '' || value === null ||
                value === undefined || value === 'null'
                    ? fallback
                    : value;

            const photo = req.file
                ? req.file.filename
                : current.photo;

            await pool.query(
                `
                UPDATE authors
                SET name = ?,
                    bio = ?,
                    photo = ?,
                    category_id = ?,
                    status = ?
                WHERE id = ?
                `,
                [
                    clean(name, current.name),
                    clean(bio, current.bio),
                    photo,
                    clean(category_id, current.category_id),
                    clean(status, current.status),
                    id
                ]
            );

            return res.json({
                success: true,
                message: 'Autor atualizado com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar autor'
            });

        }

    }

    // =========================================================
    // EXCLUIR AUTOR
    // =========================================================

    async deleteAuthor(req, res) {

        try {

            const { id } = req.params;

            await pool.query(
                `
                DELETE FROM author_books
                WHERE author_id = ?
                `,
                [id]
            );

            await pool.query(
                `
                DELETE FROM authors
                WHERE id = ?
                `,
                [id]
            );

            return res.json({
                success: true,
                message: 'Autor excluído com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao excluir autor'
            });

        }

    }

    // =========================================================
    // LISTAR AUTORES (público) - com categoria e livros
    // =========================================================

    async listPublicAuthors(req, res) {

        try {

            const [authors] =
                await pool.query(
                    `
                    SELECT
                        a.id,
                        a.name,
                        a.bio,
                        a.photo,
                        a.category_id,
                        c.name AS category_name
                    FROM authors a
                    LEFT JOIN categories c
                        ON c.id = a.category_id
                    WHERE a.status = 'active'
                    ORDER BY a.name ASC
                    `
                );

            // Busca os livros de cada autor
            for (const author of authors) {

                const [books] =
                    await pool.query(
                        `
                        SELECT
                            b.id,
                            b.title,
                            b.image,
                            b.price
                        FROM books b
                        INNER JOIN author_books ab
                            ON ab.book_id = b.id
                        WHERE ab.author_id = ?
                        `,
                        [author.id]
                    );

                author.books = books;

            }

            return res.json({
                success: true,
                authors
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao listar autores'
            });

        }

    }

}

export default new AuthorController();
