var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var db = require('./models/db');
var store = new MongoDBStore({
  uri: db.databaseUrl,
  collection: 'applicationSessions'
});

app.use(require('express-session')({
  secret: 'z78hcbp89ycha89zygco87tq',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));

var userController = require('./controllers/userController');

var contentRouter = require('./routes/routes-content');
var apiRouter = require('./routes/routes-api');

// View engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(JSON.stringify(profile));
    userController.findOrCreateUser(profile, function (msg) {
      let user = undefined;
      if (msg.result && msg.result.length > 0) {
        user = msg.result[0];
      }

      // Update display name
      if (user && user.display_name !== profile.displayName) {
        user.display_name = profile.displayName;
        userController.updateUser(user.user_id, user, (msg_update) => {
          return done(msg.error, [user]);
        });
      } else {
        return done(msg.error, msg.result);
      }
    });
  }
));

passport.serializeUser(function (user, next) {
  if (user !== undefined && user[0] !== undefined) {
    next(null, user[0].user_id);
  }
});

passport.deserializeUser(function (id, next) {
  userController.findUser(id, function (msg) {
    next(msg.error, msg.result);
  })
});

app.use('/', contentRouter);
app.use('/api/', apiRouter);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/ingredients');
  }
);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('meta/error');
});

module.exports = app;