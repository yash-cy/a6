module.exports = async (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  }
  return res.redirect('/auth/login');
};
