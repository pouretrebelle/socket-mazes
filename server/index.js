const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
require('dotenv').config();

const app = express();

// security in a box
app.use(helmet());

// store session
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 28,
    secure: false,
  },
};

// in prod use secure cookie
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}
app.use(session(sessionConfig));

// Parse requests as JSON
app.use(express.json({ limit: '5mb' }));

// Healthcheck
app.get('/', (req, res, next) => {
  res.json({
    hello: 'okay',
  });
});

// error handler
app.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
