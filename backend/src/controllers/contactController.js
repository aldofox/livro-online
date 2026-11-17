import pool from '../config/db.js';

class ContactController {

    // =========================================================
    // ENVIAR MENSAGEM DE CONTATO
    // =========================================================

    async send(req, res) {

        try {

            const {
                name,
                email,
                subject,
                message
            } = req.body;

            if (!name || !email || !message) {

                return res.status(400).json({
                    success: false,
                    message: 'Preencha nome, e-mail e mensagem'
                });

            }

            await pool.query(
                `
                INSERT INTO contacts
                (name, email, subject, message)
                VALUES (?, ?, ?, ?)
                `,
                [
                    name,
                    email,
                    subject || null,
                    message
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Mensagem enviada com sucesso!'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar mensagem'
            });

        }

    }

}

export default new ContactController();
