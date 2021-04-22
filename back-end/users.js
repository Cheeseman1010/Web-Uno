const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();

// This is the schema. Users have usernames and passwords. We solemnly promise to
// salt and hash the password!
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// This is a hook that will be called before a user record is saved,
// allowing us to be sure to salt and hash the password first.
userSchema.pre('save', async function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password'))
      return next();
  
    try {
      // generate a hash. argon2 does the salting and hashing for us
      const hash = await argon2.hash(this.password);
      // override the plaintext password with the hashed one
      this.password = hash;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
});

// This is a method that we can call on User objects to compare the hash of the
// password the browser sends with the has of the user's true password stored in
// the database.
userSchema.methods.comparePassword = async function(password) {
    try {
      // note that we supply the hash stored in the database (first argument) and
      // the plaintext password. argon2 will do the hashing and salting and
      // comparison for us.
      const isMatch = await argon2.verify(this.password, password);
      return isMatch;
    } catch (error) {
      return false;
    }
};

// This is a method that will be called automatically any time we convert a user
// object to JSON. It deletes the password hash from the object. This ensures
// that we never send password hashes over our API, to avoid giving away
// anything to an attacker.
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

// create a User model from the User schema
const User = mongoose.model('User', userSchema);

/* Middleware */

// middleware function to check for logged-in users
const validUser = async (req, res, next) => {
  //console.log(req.session);
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in, no userId"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in, can't find user"
      });
    }
    // set the user field in the request
    req.user = user;
  } catch (error) {
    // Return an error if user does not exist.
    return res.status(403).send({
      message: "not logged in, just an error"
    });
  }

  // if everything succeeds, move to the next middleware
  next();
};

/* API Endpoints */

/* All of these endpoints start with "/" here, but will be configured by the
   module that imports this one to use a complete path, such as "/api/user" */

router.use(function(req, res, next) {
    req.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", "http://localhost:8080"); //TODO: Edit later on site?
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    //res.header('Set-Cookie', 'true');
    next();
});

// create a new user
router.post('/register', async (req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // password, otherwise return an error. A 400 error means the request was
    // malformed.
    if (!req.body.username || !req.body.password)
      return res.status(400).send({
        message: "username and password are required"
      });
  
    try {
  
      //  Check to see if username already exists and if not send a 403 error. A 403
      // error means permission denied.
      const existingUser = await User.findOne({
        username: req.body.username
      });
      if (existingUser)
        return res.status(403).send({
          message: "username already exists"
        });
  
      // create a new user and save it to the database
      const user = new User({
        username: req.body.username,
        password: req.body.password
      });
      await user.save();

      // set user session info
      console.log(req.session.userID);
      req.session.userID = user._id;
      req.session.save();
      console.log(req.session.userID);

      // send back a 200 OK response, along with the user that was created
      return res.send({
        user: user
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


// login a user
router.post('/login', async (req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // password, otherwise return an error.
    console.log(req.session.userID);
    if (!req.body.username || !req.body.password)
      return res.sendStatus(400);
  
    try {
      //  lookup user record
      const user = await User.findOne({
        username: req.body.username
      });
      // Return an error if user does not exist.
      if (!user)
        return res.status(403).send({
          message: "username or password is wrong"
        });
  
      // Return the SAME error if the password is wrong. This ensure we don't
      // leak any information about which users exist.
      if (!await user.comparePassword(req.body.password))
        return res.status(403).send({
          message: "username or password is wrong"
        });

      // set user session info
      console.log(req.session.userID);
      //  TODO: For whatever reason, this request and register can access the cookie. Nobody else can.
      //  5 hours in on this issue and I still can't find the reason why.
      //  Maybe I'm blind, or just really bad at googling.
      req.session.userID = user._id;
      req.session.save();
      console.log(req.session.userID);
  
      return res.send({
        user: user
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get logged in user
router.get('/validate', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});



module.exports = {
  routes: router,
  model: User,
  valid: validUser
};