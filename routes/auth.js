const express = require('express');
const {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogout,
} = require('../controllers/auth');

const isNotAuth = require('./../middlewares/isNotAuth');
const isAuth = require('./../middlewares/isAuth');

const router = express.Router();

router.get('/login', isNotAuth, getLogin);

router.get('/signup', isNotAuth, getSignup);

router.post('/login', isNotAuth, postLogin);

router.post('/signup', isNotAuth, postSignup);

router.post('/logout', isAuth, postLogout);

module.exports = router;
