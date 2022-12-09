const Post = require('./../models/post');

exports.createBlog = async (req, res, next) => {
  await Post.create({
    ...req.body,
  });
  return res.redirect('/blogs');
};

exports.deleteBlog = async (req, res, next) => {
  await Post.deleteOne({ _id: req.body.id });
  return res.redirect('/dashboard');
};

exports.editBlog = async (req, res, next) => {
  const blog = await Post.findOne({ _id: req.query.id }).lean();
  const posts = await Post.find().lean();
  return res.render('dashboard', {
    isAdmin: req.session.user.role === 'ADMIN',
    user: req.session.user,
    blog,
    posts,
    edit: true,
  });
};

exports.saveEdits = async (req, res, next) => {
  await Post.updateOne(
    { _id: req.body.id },
    { $set: { title: req.body.title, content: req.body.content } }
  );
  return res.redirect('/dashboard');
};
