import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token não informado'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);

console.log('TOKEN DECODIFICADO:');
console.log(decoded);

req.user = decoded;

next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });

    }

};

export default authMiddleware;