const multer = require("multer");
const path = require("path");
const fs = require("fs");

const FILE_TYPE_MAP = {
  "video/mp4": "mp4",
  "video/mkv": "mkv",
  "video/webm": "webm",
  "video/avi": "avi",
  "video/quicktime": "mov"
};

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid video type");

    if (isValid) uploadError = null;

    const uploadPath = path.join(__dirname, "../uploads/videos");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(uploadError, uploadPath);
  },

  filename: function (req, file, cb) {

    const name = path.parse(file.originalname).name;
    const extension = FILE_TYPE_MAP[file.mimetype];
    const safeName = name.replace(/\s+/g, "-");

    cb(null, `${safeName}-${Date.now()}.${extension}`);
  }

});

const videoUpload = multer({ storage });

module.exports = videoUpload;   // ✅ middleware
