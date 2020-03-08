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

OAuth Exercises
- [ ] OAuth_Ex1: Add styles to `homepage` and `login` pages. You may use any css frameworks (e.g. bootstrap, materialize, or foundation)
- [ ] OAuth_Ex2: Add animations (loading) and transitions (fade in, fade out) to the same pages. You may use our previous animation exercises (e.g. 4-circle loading animation)
- [ ] OAuth_E3: Consider to create a PostgreSQL function or procedure to replace the codes in `passport-setup.js` particularly line numbers 17-36.

### Troubleshooting Guide/Issues
* [Passport Google OAuth Strategy](https://developerhandbook.com/passport.js/how-to-add-passportjs-google-oauth-strategy/)