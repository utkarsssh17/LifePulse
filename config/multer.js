import multer from "multer";

//Multer config
const storage = multer.memoryStorage();
const limits = {
    fileSize: 3 * 1024 * 1024,
};
const fileFilter = function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);


export { upload };