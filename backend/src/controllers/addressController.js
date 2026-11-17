import pool from '../config/db.js';

class AddressController {

    async findAll(req, res) {

        try {

            const customerId =
                req.user.id;

            const [addresses] =
                await pool.query(
                    `
                    SELECT *
                    FROM customer_addresses
                    WHERE customer_id = ?
                    `,
                    [customerId]
                );

            return res.json({
                success: true,
                addresses
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    'Erro ao buscar endereços'
            });

        }

    }

    async create(req, res) {

        try {

            const customerId =
                req.user.id;

            const {
                zip_code,
                street,
                number,
                complement,
                district,
                city,
                state,
                reference_point
            } = req.body;

            const [result] =
                await pool.query(
                    `
                    INSERT INTO customer_addresses
                    (
                        customer_id,
                        zip_code,
                        street,
                        number,
                        complement,
                        district,
                        city,
                        state,
                        reference_point
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        customerId,
                        zip_code,
                        street,
                        number,
                        complement,
                        district,
                        city,
                        state,
                        reference_point
                    ]
                );

            return res.status(201).json({
                success: true,
                id: result.insertId
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    'Erro ao cadastrar endereço'
            });

        }

    }

    async delete(req, res) {

        try {

            const { id } =
                req.params;

            await pool.query(
                `
                DELETE FROM
                customer_addresses
                WHERE id = ?
                `,
                [id]
            );

            return res.json({
                success: true,
                message:
                    'Endereço removido'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false
            });

        }

    }

}

export default new AddressController();