const multer = require("multer");
const path = require("path");

/* 
    Check file Type
*/
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Only 'jpeg','jpg','png' images accepted !!!");
  }
}

// Create a multer storage configuration for file uploads

const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for temporary files
  limits: { fileSize: 3 * 1024 * 1024 }, //up to 2mb
  fileFilter: function (req, file, cb) {
    //check the file type
    checkFileType(file, cb);
  },
});

module.exports = upload;
