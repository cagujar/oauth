const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passport = require('passport');
const passportSetup = require('./config/passport-setup')
const cookieSession = require("cookie-session");
const keys = require('./config/keys');

const app = express();
app.use(passport.initialize());

// set up view engine
app.set('view engine', 'ejs');

// set up cookie-session
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);

// create home route
app.get('/', (req, res)=>{
    res.render('home', {user: req.user});
});

// listen to requests
app.listen(3000, ()=> {
    console.log('app now listening for requests on port 3000');
});