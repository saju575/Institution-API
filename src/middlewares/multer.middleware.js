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

// Create a storage engine using diskStorage
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the directory where uploaded files will be temporarily stored on disk
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    // Define the filename of the uploaded file on disk
    cb(null, file.originalname);
  },
});

// Set up the multer storage and file filter for xls xlsx
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Check if the file type is either XLSX or XLS
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only XLSX and XLS files are allowed."),
      false
    );
  }
};

// Create a multer storage configuration for file uploads

exports.upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for temporary files
  limits: { fileSize: 3 * 1024 * 1024 }, //up to 2mb
  fileFilter: function (req, file, cb) {
    //check the file type
    checkFileType(file, cb);
  },
});

/* 
  upload imaage and pdf files
*/
exports.uploadMultiple = multer({
  storage: diskStorage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      req.fileType = "image";
      cb(null, true);
    } else if (file.mimetype === "application/pdf") {
      req.fileType = "pdf";
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, .jpeg, and .pdf files are allowed!"));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

// Set up multer for xlx with the defined storage and file filter
exports.uploadXlxFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});
