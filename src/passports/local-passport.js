var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var AccountManager = require('mm-module').auth.AccountManager;
var db = require('../db');

passport.use(new LocalStrategy(function(username, password, done) {
    db.get()
        .then(db => {
            var manager = new AccountManager(db, {
                username: "auth-server"
            });
            manager.authenticate(username, password)
                .then(account => {
                    return done(null, account);
                })
                .catch(e => {
                    return done(e);
                });
        })
        .catch(e => {
            done(e);
        });
}));

module.exports = passport.authenticate('local', {
    session: false
});