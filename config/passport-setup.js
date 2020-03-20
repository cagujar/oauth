const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.use(
    new GoogleStrategy({
        // options for the google strat
        callbackURL: '/auth/google/callback',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done)=>{
        // check if user already exists in our database
        console.log('##########################');
        console.log(profile);
        
        const sql1 = `select count(*) as result from "oauth".user where id=${profile.id}`;
        User.query(sql1,(err,res)=>{
            console.log(`>>>>>>>>>>>>>> res = ${JSON.stringify(res)}`)
            console.log(`>>>>>>>>>>>>>> result = ${res.rows[0].result}`)
            if(res.rows[0].result==0 && res.rows[0].result!=undefined){
                const sql2 = `INSERT INTO "oauth".user 
                VALUES( ${profile.id},
                        '${profile.displayName}',
                        ${profile.photos[0].value})`;
                User.query(sql2,(err1, res1)=>{
                    if(err1) User.end();
                    console.log("##############");
                    console.log("User has been successfully inserted!");
                    console.log(sql2);
                    User.end();
                });
                console.log("User inserted!");
            }else{
                console.log("User has been already inserted!");
            }            
        });



    })
);