const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dpjp58z8f",   // from your CLOUDINARY_URL
  api_key: "626855223385536",
  api_secret: "wMzAKVvH1cfefKepNgGFBlL1aSg"
});

module.exports = cloudinary;