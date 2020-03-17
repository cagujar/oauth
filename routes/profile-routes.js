const router = require('express').Router();

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

router.get('/', authCheck, (req,res)=>{
    const user = req.user;    
    //res.send('you are logged in, this is your profile - ' + user._name);
    res.render('profile',{ user: req.user });
});

module.exports = router;