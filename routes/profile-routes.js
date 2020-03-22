const router = require('express').Router();

//Create a user-defined middleware
const authCheck = (req, res, next)=>{
    console.log("*************************");
    console.log(req.user);
    if(!req.user){
        // User is not logged in
        res.redirect('/auth/login');
    }
    else{
        // User is logged in
        next();
    }
}

//Add authCheck middleware and update profile route
router.get('/', authCheck, (req,res)=>{
    const user = req.user;    
    res.send('you are logged in, this is your profile - ' + user._name);
});

module.exports = router;