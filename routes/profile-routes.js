const router = require('express').Router();
const User = require('../models/user-model');

const authCheck = (req, res, next)=>{
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
    res.render('profile',{ user: req.user });
});

module.exports = router;