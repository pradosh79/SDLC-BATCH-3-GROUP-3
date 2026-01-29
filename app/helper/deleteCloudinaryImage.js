const cloudinary = require("./cloudinary");

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl) return;

  // Extract public_id from URL
  const parts = imageUrl.split("/");
  const filename = parts.pop();           // react-basics-123.jpg
  const folder = parts.pop();             // courses
  const publicId = `${folder}/${filename.split(".")[0]}`;

  await cloudinary.uploader.destroy(publicId);
};

module.exports = deleteCloudinaryImage;
