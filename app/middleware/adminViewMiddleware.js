module.exports = (req, res, next) => {
  // Make current URL available in all EJS views
  res.locals.currentUrl = req.originalUrl;

  // Make logged-in admin available (safe fallback)
  res.locals.admin = req.user || null;

  next();
};
