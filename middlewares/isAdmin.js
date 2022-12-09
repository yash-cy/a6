module.exports = async (req, res, next) => {
  if (req.session.user.role === 'ADMIN') {
    return next();
  }
  return res.redirect('/');
};
