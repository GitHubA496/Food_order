// e:\JS\The Food Order\backend\utility\upload.ts
import multer from 'multer';
import path from 'path';

// Define storage for the images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

export const images = upload.array('images', 5); // Limit to 5 files