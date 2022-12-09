const Post = require('./../models/post');

exports.getHome = async (req, res, next) => {
  if (req.session.isAuth) {
    return res.redirect('/dashboard');
  }
  return res.render('home');
};

exports.getBlogs = async (req, res, next) => {
  const posts = await Post.find().lean();
  return res.render('blogs', {
    isAdmin: req.session.user.role === 'ADMIN',
    isAuth: req.session.isAuth,
    posts,
  });
};

exports.getDashboard = async (req, res, next) => {
  const posts = await Post.find().lean();
  return res.render('dashboard', {
    isAdmin: req.session.user.role === 'ADMIN',
    user: req.session.user,
    posts,
  });
};
