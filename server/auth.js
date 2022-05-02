import passport from 'passport';
import passportLocal from 'passport-local';
import { MapDatabase } from './mongodb.js';

//refs: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
// https://www.mongodb.com/languages/javascript/mongodb-and-npm-tutorial

const { Strategy } = passportLocal;

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
  done(null, user);
});

// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
  done(null, uid);
});


// Passport Configuration
// Create a new LocalStrategy object to handle authentication using username and
// password credentials from the client. The LocalStrategy object is used to
// authenticate a user using a username and password.
const strategy = new Strategy(async (email, password, done) => {
  //calling collections.find()
  if (this.db.findUser(username).count() === 0) {
    // no such user
    return done(null, false, { message: 'Wrong username' });
  }
  else if (this.db.validateLogin(email, password)) {
    // invalid password
    // should disable logins after N messages
    // delay return to rate-limit brute-force attacks
    await new Promise((r) => setTimeout(r, 2000)); // two second delay
    return done(null, false, { message: 'Wrong password' });
  }
  // success!
  // should create a user object here, associated with a unique identifier
  return done(null, username);
});

// Configure passport to use the LocalStrategy object.
// The LocalStrategy object is used to authenticate a user using a username and
// password. There are other strategies available, but this is the simplest.
passport.use(strategy);


export default {
  configure: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },

  authenticate: (domain, where) => {
    return passport.authenticate(domain, where);
  },
};


