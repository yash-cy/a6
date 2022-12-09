const express = require('express');
const { getHome, getBlogs, getDashboard } = require('../controllers/home');
const router = express.Router();

const isAuth = require('./../middlewares/isAuth');

router.get('/dashboard', isAuth, getDashboard);

router.get('/blogs', getBlogs);

router.get('/', getHome);

module.exports = router;
