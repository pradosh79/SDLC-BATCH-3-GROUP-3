const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../helper/cloudinary");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "courses",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    public_id: (req, file) => {
      const name = file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .toLowerCase();

      return `${name}-${Date.now()}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (!FILE_TYPE_MAP[file.mimetype]) {
    cb(new Error("Invalid image type"), false);
  } else {
    cb(null, true);
  }
};

const uploadImage = multer({
  storage,
  fileFilter,
});

module.exports = uploadImage;
