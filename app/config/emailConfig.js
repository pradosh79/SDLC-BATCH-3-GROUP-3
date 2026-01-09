require('dotenv').config();
const nodemailer = require('nodemailer');


// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  //host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  //
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "apnarlibrary@gmail.com",
    pass: process.env.EMAIL_PASS || "swom snsu gqak sdep",
  },
});

module.exports = transporter