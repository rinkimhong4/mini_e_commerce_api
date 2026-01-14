const multer = require("multer");
const path = require("path");
// Storage config
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, "public/images"); // folder path
        
},
filename: (req, file, cb)=>{
cb(null, Date.now() + path.extname(file.originalname));
}
});
// File filter (only images)
const fileFilter = (req, file, cb) => {
const allowedTypes = /jpeg|jpg|png|webp/;
const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
const mime = allowedTypes.test(file.mimetype);
if (ext && mime) {
cb(null, true);
} else {
cb(new Error("Only images are allowed"));
}
};
const upload = multer({
storage,
fileFilter,
limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
module.exports = upload;