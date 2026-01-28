const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const AuthCheckAdmin = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.adminToken) {
      return res.redirect('/admin');
    }

    jwt.verify(
      req.cookies.adminToken,
      process.env.JWT_SECRET_ADMIN,
      async (err, decoded) => {
        if (err) {
          return res.redirect('/admin');
        }

        console.log('auth', decoded);

        // ✅ FETCH FULL ADMIN DATA FROM DB
        const admin = await User.findById(decoded.user_id);
        if (!admin) {
          return res.redirect('/admin');
        }

        // ✅ THIS IS THE IMPORTANT FIX
        req.user = admin;

        next();
      }
    );

  } catch (error) {
    console.log('Admin auth error:', error);
    return res.redirect('/admin');
  }
};

module.exports = AuthCheckAdmin;
