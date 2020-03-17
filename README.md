# OAuth Demo by Clyde Balaman

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

## Part 6: Cookie Session

1. Require cookie-session module ```npm install cookie-session```
```bash
# Use cookie-session to control our HTTP session
# HTTP session allows web servers to maintain user identity and to store user-specific data during request/response interactions between a client application and a web application.
```
2. Encrypt key
```js
// set up cookie-session
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['secret encrypt key']
}));
```
3. Update ```config/keys.js``` and initialize passport
```js
// config/keys.js
module.exports = {
    google:{...},
    postgresdb:{...},
    session:{
        cookieKey: 'thisismyuniquecookiekey'
    }
};
// index.js
app.use(passport.initialize());
app.use(passport.session());
```
4. OAuth Test
* Test our web app @ loalhost:3000
* Login using Google
* Then you need to see a json value printed on your web page

## Part 6-1: Redirecting Users

1. Create a user-defined middleware in ```routes/profile-routes.js```
```js
const authCheck = (req, res, next)=>{
    console.log("*********** Performing AuthCheck **************");
    console.log(req.user);
    if(!req.user){
        // If user is not logged in then
        res.redirect('/auth/login');
    }
    else{
        // If user is logged in then
        next();
    }
}
```

2. Add authCheck middleware and update profile route
```js
router.get('/', authCheck, (req,res)=>{
    const user = req.user;    
    res.send('you are logged in, this is your profile - ' + user._name);
});
```

3. Update ```config/passport-user.js``` deserializeUser method
```js
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
```
For more information about PostgreSQL JSON Functions and Operators e.g. ```row_to_json```, view the link [here](https://www.postgresql.org/docs/9.5/functions-json.html).

4. Check if all slugs/routes redirecting to the correct target slugs

* Before Logging in (note: need to clear cache)

  - Navigate to ```http://localhost:3000/profile``` then our app will *redirect* to ```http://localhost:3000/auth/login```.
  - Navigate to ```http://localhost:3000/auth/login``` and login using google then our app will ask your gmail account. If google successfully verified the account then our app will *redirect* to ```http://localhost:3000/profile```.

* After a successful login

  - Navigate to ```http://localhost:3000/auth/login``` then our app will *redirect* to ```http://localhost:3000/profile```.

## Part 7: Viewing Profile

1. Update profile route. Use ```res.render``` instead re.send. The second argument contains a json object that we will pass to the profile view page.
```js
router.get('/', authCheck, (req,res)=>{
    const user = req.user;    
    //res.send('you are logged in, this is your profile - ' + user._name);
    res.render('profile',{ user: req.user });
});
```

2. Create ```views/profile.ejs```.
```html
    <h1>Welcome to your profile, <%= user._name %> </h1>    
    <p>
        extra information about you
    </p>
```

## Part 8: User Logout

1. Update logout handler
```js
// auth logout
router.get('/logout',(req, res)=>{
    // handle with passport
    // res.send('logging out');
    req.logout();
    res.redirect('/');
});
```

2. Fixed navigation links. Show a menu only when needed.
Example:
* No Logout link if the user is in slug:```http://localhost:3000/``` and the user was not yet log in

3. Add profile picture

```js
// views/profile.ejs
...
<h1>Welcome to your profile, <%= user._name %> </h1>    
<p>
    extra information about you
    <img src="<%= user._picture %>" alt="picture">
    <p>This is your profile thumbnail</p>
</p>
...
```

OAuth Exercises (Part 5-8)
- [X] OAuth_Ex4: Create slugs for the following schema. Make sure that all slugs must have a hyperlink inside ```profile.ejs```.

> Human Resource Schema

| Slugs                            | Descriptions                                      | Views (.ejs)    |
| -------------------------------- |:-------------------------------------------------:|:---------------:|
| localhost:3000/hr/emp            | A web page that display the list of employees     | employee.ejs    |
| localhost:3000/hr/dept           | A web page that display the list of departments   | department.ejs  |
| localhost:3000/hr/empdept        | A web page that display the firstname, lastname, department number, and department name for each employee   | empdept.ejs  |
| localhost:3000/hr/salary         | A web page that display the name (firstname and lastname) for those employees who gets more salary than the employee whose ID is 135.   | salary.ejs  |

> Northwind Schema

| Slugs                            | Descriptions                                      | Views (.ejs)    |
| ---------------------------------- |:-------------------------------------------------:|:---------------:|
| localhost:3000/northwind/prod      | A web page that display the list of product       | product.ejs     |
| localhost:3000/northwind/cat       | A web page that display the list of category      | category.ejs    |
| localhost:3000/northwind/prodcat   | A web page that display the product name, unit price, category id, and category name for each product   | prodcat.ejs  |
| localhost:3000/northwind/expensive | A web page that display Product list (name, unit price) of twenty most expensive products.   | expensive.ejs  |

> Note: Consider [Simple-DataTables](https://github.com/fiduswriter/Simple-DataTables) for a lightweight, extendable, dependency-free javascript HTML table plugin. Similar to jQuery DataTables, ***but without the jQuery dependency***.

- [X] OAuth_Ex5: Add five more strategies. (e.g. Facebook, Twitter, Github, etc.)
- [X] OAuth_Ex6: Push to Heroku (AppName: ```lastname-oauth.herokuapp.com``` )
