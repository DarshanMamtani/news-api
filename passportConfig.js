const LocalStratergy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');


const initialize = (passport) => {

    // * AUthenticate User
    const authenticateUser = (email, password, done) => {
        pool.query(`SELECT * FROM users WHERE email = $1`, [email],
            (err, results) => {
                if (err) {
                    console.log(err);
                }

                // * If User is found in DB
                if (results.rows.length > 0) {
                    const user = results.rows[0];

                    // * Comapring password entered and password in DB 
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Incorrect Password" });
                        }
                    }); // End of comapring passwords
                } // * If user not  found in DB  
                else {
                    return done(null, false, { message: "Email not registered" })
                }
            }
        ); // End of query i.e. searchin in DB
    }

    passport.use(new LocalStratergy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        authenticateUser)
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM users WHERE id = $1`, [id],
            (err, results) => {
                if (err) {
                    console.log(err);
                }
                return done(null, results.rows[0]);
            }
        );
    });

}

module.exports = initialize;