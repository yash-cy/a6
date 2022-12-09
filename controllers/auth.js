const bcrypt = require('bcryptjs');

const User = require('./../models/user');

exports.getLogin = async (req, res, next) => {
  const errors = await req.flash('errors');
  const oldData = (await req.flash('oldData'))[0];
  return res.render('login', {
    title: 'Log In',
    hasErrors: errors.length > 0 ? true : false,
    errors,
    oldData,
  });
};

exports.getSignup = async (req, res, next) => {
  const errors = await req.flash('errors');
  const oldData = (await req.flash('oldData'))[0];
  return res.render('signup', {
    title: 'Sign Up',
    hasErrors: errors.length > 0 ? true : false,
    errors,
    oldData: oldData,
  });
};

exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;
  errors = [];
  if (!username || !username.match(/^[a-zA-Z]*$/)) {
    errors.push('Please enter username in valid format');
  }
  if (
    !password ||
    password.length < 8 ||
    !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  ) {
    errors.push(
      'Password must be at least 8 characters and must contain at least each of uppercase lowercase and a number'
    );
  }

  if (errors.length > 0) {
    return res.render('login', {
      title: 'Log In',
      errors,
      hasErrors: true,
      oldData: req.body,
    });
  }

  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    errors.push('User does not exist');
  }

  const isMatch = await bcrypt.compare(password, existingUser?.password || '');

  if (!isMatch) {
    errors.push('Sorry, you entered the wrong username and/or password');
  }

  if (errors.length > 0) {
    req.flash('errors', errors);
    req.flash('oldData', req.body);
    return res.redirect('/auth/login');
  }

  req.session.isAuth = true;
  req.session.user = existingUser;

  req.session.save(() => {
    return res.redirect('/dashboard');
  });
};

exports.postSignup = async (req, res, next) => {
  errors = [];
  const { name, username, email, password, confirmPassword } = req.body;
  if (!name || !name.match(/[\w]+\s+[\w]+/)) {
    errors.push('Please enter name in valid format');
  }
  if (!username || !username.match(/^[a-zA-Z]*$/)) {
    errors.push('Please username in valid format');
  }
  if (
    !email ||
    !email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    errors.push('Please email in valid format');
  }
  if (
    !password ||
    password.length < 8 ||
    !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  ) {
    errors.push(
      'Password must be at least 8 characters and must contain at least each of uppercase lowercase and a number'
    );
  }
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  }
  if (confirmPassword != password) {
    errors.push('Passwords do not match');
  }

  const user = await User.findOne({ email });

  if (user) {
    errors.push('User already exists');
  }

  if (errors.length > 0) {
    await req.flash('errors', errors);
    await req.flash('oldData', req.body);
    return res.redirect('/auth/signup');
  }

  const hash = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    ...req.body,
    firstName: name.split(' ')[0],
    lastName: name.split(' ')[1],
    password: hash,
  });

  req.session.isAuth = true;
  req.session.user = newUser;

  req.session.save(() => {
    return res.redirect('/dashboard');
  });
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect('/auth/login');
  });
};
