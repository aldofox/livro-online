export default function adminMiddleware(
    req,
    res,
    next
) {

    console.log('ADMIN MIDDLEWARE');
    console.log(req.user);

    if (
        req.user.role !== 'admin'
    ) {

        return res.status(403).json({
            success: false,
            message: 'Acesso negado'
        });

    }

    next();

}