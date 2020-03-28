const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const GitHubStrategy = require('passport-github').Strategy;
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


//GOOGLE PASSPORT
passport.use(
    new GoogleStrategy({
        // options for the google strat
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done)=> {
    
        User.query(`CALL "oauth".insertUnique(${profile.id},
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


}));


//FACEBOOK PASSPORT
passport.use(
    new FacebookStrategy(
    {
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: "/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'name', 'gender', 'photos']
    },
   (accessToken, refreshToken, profile, cb) => 
   {   

        User.query(
            `CALL "oauth".insertUnique('${profile.id}', '${profile.displayName}', '${profile.photos[0].value}')`,
            (err,res)=>
            {
                 const _user = 
                 {
                            id: profile.id,
                            name: profile.displayName,                              
                            picture: profile.photos[0].value
                 };

                if (err) 
                {
                     const currentUser = _user;
                    cb(null, currentUser);
                }
                else
                {
                     const newUser = _user;
                    cb(null, newUser);
                }
            }
        );
   }
));


//GITHUB PASSPORT
passport.use(
        new GitHubStrategy(
        {
            clientID: keys.github.clientID,
            clientSecret: keys.github.clientSecret,
            callbackURL: "/auth/github/redirect"
        },
        (accessToken, refreshToken, profile, cb) => 
        {
                 User.query(
                `CALL "oauth".insertUnique('${profile.id}', '${profile.username}', '${profile.photos[0].value}')`,
                (err,res)=>
                {
                     const _user = 
                     {
                                id: profile.id,
                                name: profile.displayName,                              
                                picture: profile.photos[0].value
                     };

                    if (err) 
                    {
                         const currentUser = _user;
                        cb(null, currentUser);
                    }
                    else
                    {
                         const newUser = _user;
                        cb(null, newUser);
                    }
                }
            );
        }
    )
    );
