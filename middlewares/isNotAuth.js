module.exports = async (req, res, next) => {
  if (req.session.isAuth) {
    return res.redirect('/dashboard');
  }
  return next();
};
