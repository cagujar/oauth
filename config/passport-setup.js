const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');


/*
- The user id (you provide as the second argument of the done function) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.
- SerializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}.
*/
passport.serializeUser((user, done)=>{
    done(null, user.id); // A piece of info and save it to cookies
});

/*
- The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see serializeUser.). 
- So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc). 
- In deserializeUser that key is matched with the in memory array / database or any data resource.
*/
passport.deserializeUser((id, done)=>{
    //Who's id is this?
    User.query(`SELECT "oauth".findById(${id})`,(err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res.rows[0]);
            done(null, user); 
        }        
    });
});



User.query(`CALL "oauth".insert_when_unique(${profile.id},
    '${profile.displayName}',
    '${profile.photos[0].value}');`,
(err,res)=>{

if(err){
//already have the user
}
else{
//if not, new user was created in our db
}

});


/*
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

*/