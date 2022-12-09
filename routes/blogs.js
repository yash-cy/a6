const {
  createBlog,
  deleteBlog,
  editBlog,
  saveEdits,
} = require('../controllers/blogs');

const router = require('express').Router();

const isAuth = require('./../middlewares/isAuth');
const isAdmin = require('./../middlewares/isAdmin');

router.get('/posts/edit', isAuth, isAdmin, editBlog);

router.post('/posts/edit', isAuth, isAdmin, saveEdits);

router.post('/posts/delete', isAuth, isAdmin, deleteBlog);

router.post('/posts', isAuth, isAdmin, createBlog);

module.exports = router;
