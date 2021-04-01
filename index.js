const express = require('express');
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passportConfig');

const app = express();
const PORT = process.env.PORT || 3000;

initializePassport(passport);

// * MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// * SignUp Route
app.post('/signup', async (req, res) => {
    let { email, name, password } = req.body;
    let hashPassword = await bcrypt.hash(password, 10);

    // * Checking if user already exist
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.rows.length > 0) {
            res.status(201).send("User Already Exists");
        }
        // * User does not exist
        else {
            pool.query(
                `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id`,
                [email, name, hashPassword],
                (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    res.status(200).send("Resgistration Successful. Please Login to Continue");
                }
            ) // End of INSERT query
        } //End of else where registering user i.e. inserting data
    }) // End of SELCT * query i.e. Checking if user exist
}); // End of /signup endpoint


// * Login route
app.put('/login', passport.authenticate('local'), (req, res) => {
    res.send("Login Succesfull! Welcome " + req.user.name);
});


// * Function to check whether is Logged in or not
const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send("You're not authorized");
    }
}


// * Create NEWS
app.post('/news', checkAuthentication, (req, res) => {
    let { title, description } = req.body;
    let userid = req.user.id;

    pool.query(`INSERT INTO news (title, description, userid) VALUES ($1, $2, $3) RETURNING id`, [title, description, userid],
        (err, results) => {
            if (err) {
                console.log(err);
            }
            res.status(200).send("News successfully Added with id: " + results.rows[0].id);
        }
    ); //End of query
}); // End of post


// * Update NEWS
app.patch('/news', checkAuthentication, (req, res) => {
    let { id, title, description } = req.body;

    // * Fetching the news first to validate that user is publisher
    pool.query(`SELECT * FROM news WHERE id = $1`, [id],
        (err, results) => {
            if (err) {
                console.log(err);
            }
            
            // * Checking if user is one who has published the news
            if (results.rows[0].userid === req.user.id) {
                
                // * If user is same as publisher then updating the news
                pool.query(`UPDATE news SET tiTle = $1, description = $2 WHERE id = $3 RETURNING id`, [title, description, id],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        }

                        res.status(200).send("News successfully updated with id: " + results.rows[0].id);
                    }
                ); // End of update query
            } else {
                // * If user is not same as publisher then sending 401: Unauthorized
                res.status(401).send("You are not authorized to update the news");
            }
        }
    ); // End of SELECT query
});

// * Delete NEWS
app.delete('/news', checkAuthentication, (req, res) => {
    let { id } = req.body;

    // * Fetching the news first to validate that user is publisher
    pool.query(`SELECT * FROM news WHERE id = $1`, [id],
        (err, results) => {
            if (err) {
                console.log(err);
            }
            
            // * Checking if user is one who has published the news
            if (results.rows[0].userid == req.user.id) {

                // * If user is same as publisher then deleting the news
                pool.query(`DELETE FROM news WHERE id = $1`, [id],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        res.status(200).send("News successfully Deleted");
                    }
                ); //End of DELETE query
            } else {
                // * If user is not same as publisher then sending 401: Unauthorized
                res.status(401).send("You are not authorized to delete the news");
            }
        }
    ); //End of SELECT query
});

// * Get News
app.get('/news', checkAuthentication, (req, res) => {
    // * Fetching all the News
    pool.query(`SELECT * FROM news`, (err, results) => {
        if(err){
            console.log(err);
        }

        res.status(200).send(results.rows);
    }); //End of query
});

// * Get News with id
app.get('/news/:id', checkAuthentication, (req, res) => {
    // * Fetching news with id
    pool.query(`SELECT * FROM news WHERE id = $1`, [req.params.id], (err, results) => {
        if(err){
            console.log(err);
        }

        res.status(200).send(results.rows);
    }); //end of query 
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});