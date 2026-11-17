import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/authors');

    },

    filename: (req, file, cb) => {

        const extension = path.extname(file.originalname);

        const filename =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1000000) +
            extension;

        cb(null, filename);

    }

});

const upload = multer({

    storage,

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.mimetype)) {

            return cb(
                new Error('Formato de imagem não permitido')
            );

        }

        cb(null, true);

    }

});

export default upload;
