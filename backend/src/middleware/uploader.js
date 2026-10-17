const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid format! Only JPEG and PNG are allowed.'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 6 * 1024 * 1024,
        files: 13,
    },
    fileFilter,
});

module.exports = upload;