import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateRandomString } from './../utils/index.js';

// define __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// define target directory
const targetDir = path.join(__dirname, './../../public/uploads/products/');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, targetDir);
    },
    filename: (req, file, callback) => {
        const name = path.parse(file.originalname).name;
        const ext = path.parse(file.originalname).ext;

        const newFileName = name + '_' + generateRandomString(8) + ext;
        callback(null, newFileName);
    },
});

const fileFilter = (req, file, callback) => {
    const acceptedExts = ['jpg', 'jpeg', 'png', 'gif'];
    const ext = file.mimetype.split('/')[1];

    if (!acceptedExts.includes(ext)) {
        const error = {
            status: 'failed',
            message: `Please choose images with extensions such as ${acceptedExts.join(', ')}`,
        };
        callback(error, false);
    }
    callback(null, true);
};

const limits = {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 20,
};

const upload = multer({
    storage,
    fileFilter,
    limits,
}).array('product_images', 20);

export default upload;
