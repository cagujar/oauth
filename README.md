# OAuth Demo by Chrissa Mae Agujar

## Part 1: Setting up NodeJS environment
```bash
> npm init -y
> npm install express ejs
> npm install nodemon -g
> nodemon index.js
```

## Part 2: Setting up Authentication Routes
* localhost:3000/auth/login
* localhost:3000/auth/logout
* localhost:3000/auth/google

## Part 3: Setting up Passport
```bash
> npm install passport passport-google-oauth20
> type nul > passport-setup.js
# Create new project 'Lastname2020' - https://console.developers.google.com/
# Navigate to Getting Started > Enable APIs and Services. Look for Google+ API then Enable and Create Credentials. See troubleshooting guide for some guidance.
# Which API are you using? Google+ API
# Key: AIzaSyCBuJqhFdLoYXeK3MHfWmrfoJAdAE_Onrw
# Client ID: 150322459579-bgldudsea3rfokitrcphot3mbrupiov7.apps.googleusercontent.com
# Client Secret: C74lVpQQa1oID8luyEIXsAO8
> nodemon index.js
```

## Part 4: Store all users to Database (e.g. PostgreSQL)
```bash
> npm install pg path dotenv
# Launch pgadmin and create 'oauth' schema with 'user' table
# create table "oauth".user(
# 	id numeric primary key,
# 	name varchar(100),
# 	picture text
# );
> nodemon index.js
```

OAuth Exercises (Part 1-4)
- [X] OAuth_Ex1: Add styles to `homepage` and `login` pages. You may use any css frameworks (e.g. bootstrap, materialize, or foundation)
- [X] OAuth_Ex2: Add animations (loading) and transitions (fade in, fade out) to the same pages. You may use our previous animation exercises (e.g. 4-circle loading animation)
- [X] OAuth_E3: Consider to create a PostgreSQL function or procedure to replace the codes in `passport-setup.js` particularly line numbers 17-36.

### Troubleshooting Guide/Issues
* [Passport Google OAuth Strategy](https://developerhandbook.com/passport.js/how-to-add-passportjs-google-oauth-strategy/)


### Answer to OAuth_E3
Procedure 1: insert_when_unique(numeric, character varying, text)
```sql
CREATE OR REPLACE PROCEDURE "oauth".insert_when_unique(NUMERIC, CHARACTER VARYING, TEXT)    
AS $BODY$
DECLARE result "oauth"."user"."id"%type;
BEGIN
    -- count all records with the given id and save to result	
    select "oauth".isUserFound($1) into result;	
 	-- raise notice 'result is: %', result;
		
 	IF result=0 THEN -- Tf there no exist same id
		-- raise notice 'OK result: %', result;
		INSERT INTO "oauth"."user" VALUES($1,$2,$3);
		raise notice 'id % has been inserted', $1;
	ELSE 
		IF result=1 THEN -- If there exist same id
			-- raise notice 'NOT OK result: %', result;
			raise exception 'id % is already existing', $1;
		END IF;
	END IF;
 
    COMMIT;
END;
$BODY$
LANGUAGE plpgsql;
```

Function 1: findById(numeric)
```sql
CREATE OR REPLACE FUNCTION "oauth".findById(IN val numeric)
RETURNS TABLE (
		_id numeric,
		_name character varying(100),
		_picture text
	)
AS $BODY$
BEGIN
	RETURN QUERY
		SELECT *
		FROM "oauth".user 
		WHERE id = val;
END;
$BODY$
LANGUAGE 'plpgsql';
-- select "oauth".findById(102332425917258700713);
```

Call Procedure 1
```sql
CALL "oauth".insert_when_unique(123,'abc','def');
```

## Part 5: Progress Refresh

Updated ```passport-setup.js``` script
```js
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

...

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
```