const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login',(req, res)=>{
    res.render('login', {user: req.user});
});

// auth logout
router.get('/logout',(req, res)=>
{
    req.logout();
    res.redirect('/');
});

// auth with google
router.get('/google',passport.authenticate('google',{
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect',passport.authenticate('google'),(req, res)=>
{   
    res.redirect('/profile/');
});

//auth with facebook
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/redirect',passport.authenticate('facebook', { failureRedirect: '/login' }),(req, res)=>
{
   	res.redirect('/profile/');
});

//auth with github
router.get('/github', passport.authenticate('github'));
router.get('/github/redirect',passport.authenticate('github', { failureRedirect: '/login' }),(req, res) => {
    	res.redirect('/profile/');
});


module.exports = router;