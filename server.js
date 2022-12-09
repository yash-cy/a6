const expressHbs = require('express-handlebars');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const DB = require('./utils/database');

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const blogRoutes = require('./routes/blogs');

const app = express();

app.engine(
  'hbs',
  expressHbs.engine({
    extname: '.hbs',
    defaultLayout: false,
    layoutsDir: 'views',
  })
);

const store = new MongoDBStore({
  uri: 'mongodb+srv://ysp23232:ysp9879@senecaweb.5bcsffy.mongodb.net/?retryWrites=true&w=majority',
  collection: 'sessions',
});

app.use(
  session({
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoutes);
app.use('/', homeRoutes, blogRoutes);

DB()
  .then(() => {
    console.log('Database connected');
    return app.listen(3000);
  })
  .then(() => {
    console.log('App Started');
  })
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });
