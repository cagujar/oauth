# OAuth Demo by Clyde Balaman

## Environment
- [ ] Part 1: Setting up NodeJS environment
- [ ] Part 2: Authentication Routes
- [ ] Part 3: Passport Configuration
- [ ] Part 4: PostgreSQL Store and Retrieve

## User Activity
- [ ] Part 5: Progress Refresh
- [ ] Part 6: Cookie Session
- [ ] Part 7: Viewing Profile
- [ ] Part 8: User Logout

### Code Snippets

```config/keys.js```
```js
// add this file to .gitignore
module.exports = {
    google:{
        clientID: '<YOUR_CLIENTID_HERE>',
        clientSecret: '<YOUR_CLIENTSECRET_HERE>'
    },
    postgresdb:{
        user: '<YOUR_USERNAME_HERE>', 
        host: '<YOUR_HOST_HERE>',
        database: '<YOUR_DATABASE_HERE>', 
        password: '<YOUR_PASSWORD_HERE>', 
        port:'<YOUR_PORT_HERE>',
        ssl:true,
    }
};
```

### Sources
* [PassportJS](http://www.passportjs.org/)
* [DeveloperHandbook](https://developerhandbook.com/passport.js/how-to-add-passportjs-google-oauth-strategy/)
* [The Net Ninja](https://www.youtube.com/watch?v=BZwzWgLA0JA&list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x&index=13)