const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done)=>{
    done(null, user.id); // A piece of info and save it to cookies
});

passport.deserializeUser((id, done)=>{
    //Who's id is this?
    User.query(`select row_to_json (u) from ( SELECT "oauth".findById(${id}) as user) u;`,(err,res)=>{
        if(err){
            console.log(err);
        }else{                        
            const user = res.rows[0].row_to_json.user;
            console.log(">>>> deserializeUser >>>>> ",user);
            done(null, user); 
        }        
    });
});

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
        
        // const sql1 = `select count(*) as result from "oauth".user where id=${profile.id}`;
        // User.query(sql1,(err,res)=>{
        //     console.log(`>>>>>>>>>>>>>> res = ${JSON.stringify(res)}`)
        //     console.log(`>>>>>>>>>>>>>> result = ${res.rows[0].result}`)
        //     if(res.rows[0].result==0 && res.rows[0].result!=undefined){
        //         const sql2 = `INSERT INTO "oauth".user 
        //         VALUES( ${profile.id},
        //                 '${profile.displayName}',
        //                 ${profile.photos[0].value})`;
        //         User.query(sql2,(err1, res1)=>{
        //             if(err1) User.end();
        //             console.log("##############");
        //             console.log("User has been successfully inserted!");
        //             console.log(sql2);
        //             User.end();
        //         });
        //         console.log("User inserted!");
        //     }else{
        //         console.log("User has been already inserted!");
        //     }            
        // });

        User.query(`CALL "oauth".insert_when_unique(${profile.id},
                                                    '${profile.displayName}',
                                                    '${profile.photos[0].value}');`,
                    (err,res)=>{
                        console.log(">>>>>>>>>>>>>>>>>>>>>>");
                        const _user = {
                            id: profile.id,
                            name: profile.displayName,                                
                            picture: profile.photos[0].value
                        };

                        if(err){
                            //already have the user
                            const currentUser = _user;
                            console.log('User is ', JSON.stringify(currentUser));
                            done(null, currentUser);
                            //console.log(err);
                        }else{
                            //if not, new user was created in our db
                            const newUser = _user;
                            console.log('New User created: ' + JSON.stringify(newUser));
                            done(null, newUser);
                            // console.log(res.rows[0]);
                        }
                    });


    })
);