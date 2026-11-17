import pool from '../config/db.js';

class OrderController {

  async myOrders(req, res) {

    try {

        const customerId =
            req.user.id;

        const [orders] =
            await pool.query(
                `
                SELECT
                    id,
                    total,
                    shipping,
                    discount,
                    payment_method,
                    payment_status,
                    order_status,
                    installments,
                    created_at
                FROM orders
                WHERE customer_id = ?
                ORDER BY id DESC
                `,
                [customerId]
            );

        return res.json({
            success: true,
            orders
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                'Erro ao buscar pedidos'
        });

    }

}

   async findById(req, res) {

    try {

        const customerId =
            req.user.id;

        const { id } =
            req.params;

        const [orders] =
            await pool.query(
                `
                SELECT
                    o.*,

                    ca.zip_code,
                    ca.street,
                    ca.number,
                    ca.complement,
                    ca.district,
                    ca.city,
                    ca.state

                FROM orders o

                LEFT JOIN customer_addresses ca
                    ON ca.id = o.address_id

                WHERE o.id = ?
                AND o.customer_id = ?
                `,
                [id, customerId]
            );

        if (orders.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    'Pedido não encontrado'
            });

        }

        const [items] =
            await pool.query(
                `
                SELECT
                    oi.*,
                    b.title,
                    b.image

                FROM order_items oi

                INNER JOIN books b
                    ON b.id = oi.book_id

                WHERE oi.order_id = ?
                `,
                [id]
            );

        return res.json({
            success: true,
            order: orders[0],
            items
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                'Erro ao buscar pedido'
        });

    }

}

    async create(req, res) {

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        const customerId =
            req.user.id;

        const {
            address_id,
            payment_method,
            installments,
            items
        } = req.body;

        if (!items || items.length === 0) {

            return res.status(400).json({
                success: false,
                message:
                    'Carrinho vazio'
            });

        }

        let total = 0;

        items.forEach(item => {

            total +=
                Number(item.price) *
                Number(item.quantity);

        });

        const [orderResult] =
            await connection.query(
                `
                INSERT INTO orders
                (
                    customer_id,
                    address_id,
                    total,
                    payment_method,
                    payment_status,
                    order_status,
                    installments
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    customerId,
                    address_id,
                    total,
                    payment_method,
                    'pending',
                    'waiting_payment',
                    installments || 1
                ]
            );

        const orderId =
            orderResult.insertId;

        for (const item of items) {

            const subtotal =
                Number(item.price) *
                Number(item.quantity);

            await connection.query(
                `
                INSERT INTO order_items
                (
                    order_id,
                    book_id,
                    quantity,
                    price,
                    subtotal
                )
                VALUES
                (?, ?, ?, ?, ?)
                `,
                [
                    orderId,
                    item.book_id,
                    item.quantity,
                    item.price,
                    subtotal
                ]
            );

        }

        await connection.commit();

        return res.status(201).json({

            success: true,

            order_id: orderId

        });

    } catch (error) {

        await connection.rollback();

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                'Erro ao criar pedido'

        });

    } finally {

        connection.release();

    }

}

}

export default new OrderController();