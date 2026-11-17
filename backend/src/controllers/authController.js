import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {

    async register(req, res) {
    

        try {

            const {
                name,
                email,
                password
            } = req.body;

            const [userExists] = await pool.query(
                'SELECT * FROM customers WHERE email = ?',
                [email]
            );

            if (userExists.length > 0) {

                return res.status(400).json({
                    success: false,
                    message: 'E-mail já cadastrado'
                });

            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.query(
                `
                INSERT INTO customers
                (name, email, password)
                VALUES (?, ?, ?)
                `,
                [name, email, hashedPassword]
            );

            return res.status(201).json({
                success: true,
                message: 'Cliente cadastrado com sucesso'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno servidor'
            });

        }

    }

    async login(req, res) {

        try {

            const { email, password } = req.body;

            const [users] = await pool.query(
                'SELECT * FROM customers WHERE email = ?',
                [email]
            );

            if (users.length === 0) {

                return res.status(400).json({
                    success: false,
                    message: 'E-mail ou senha inválidos'
                });

            }

            const user = users[0];
            console.log('USUARIO LOGIN:');
            console.log(user);
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {

                return res.status(400).json({
                    success: false,
                    message: 'E-mail ou senha inválidos'
                });

            }
            console.log('USUARIO LOGIN:');
console.log(user);
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            );
            console.log('TOKEN GERADO:');
console.log(token);

console.log('PAYLOAD:');
console.log({
    id: user.id,
    email: user.email,
    role: user.role
});

            return res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno servidor'
            });

        }

    }

}

export default new AuthController();