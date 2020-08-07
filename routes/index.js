'use strict';
var express = require('express');
var router = express.Router();
var itemsModel = require('../models/items');
var inquiriesModel = require('../models/inquiries');
var userModel = require('../models/user');
var passport = require('passport');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', {user: req.user });
});

/* POST for login. */
// Try to login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/listing',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/* GET logout page. */
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

/*POST for register. */
router.post('/register', function (req, res) {
    // Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash
        }
        // Check if the user name already exists
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (user.length) {
                console.log('Username already exists please login.');
                return res.redirect('/login');
            }
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('Inserting');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/listing');
                });
            });
        });
    })
});


/* GET for register. */
router.get('/register', function (req, res) {
    res.render('register');
});


/* GET listing page. */
router.get('/listing', function (req, res) {
    try {
        // Retrieve items and pass if found, to the pug file
        itemsModel.find({}, function (err, foundItems) {
            console.log(err);
            console.log(foundItems);
            res.render('listing', { items: foundItems, user: req.user });
        });
    } catch (err) {
        console.log(err);
        res.render('listing');
    }
});

/* GET insert page. */
router.get('/insert', function (req, res) {
    res.render('insert');
});

/* POST insert page. */
router.post('/insert', function (req, res) {
    // Create a new item using the itemsModel Schema and insert it into the DB
    const item = new itemsModel({ title: req.body.title, description: req.body.description, price: req.body.price });
    item.save(function (err) {
        console.log(err);
        res.redirect('/listing');
    });
});

/* GET edit page. */
router.get('/edit/:id', function (req, res) {
    itemsModel.findById(req.params.id, function (err, foundItem) {
        if (err) console.log(err);
        // Render the edit page with the item being edited
        res.render('edit', { item: foundItem })
    })
});

/* POST edit page. */
router.post('/edit', function (req, res) {
    console.log(req.body);
    // Find and edit item by Id
    itemsModel.findByIdAndUpdate(req.body.id, { title: req.body.title, description: req.body.description, price: req.body.price }, function (err, model) {
        console.log(err);
        res.redirect('/listing');
    });
});

/* POST delete page. */
router.post('/delete/:id', function (req, res) {
    // Find and delete item by Id
    itemsModel.findByIdAndDelete(req.params.id, function (err, model) {
        res.redirect('/listing');
    });
});

/* GET contact me page. */
router.get('/contact', function (req, res) {
    res.render('contact', {user: req.user });
});

/* POST contact me page. */
router.post('/contact', function (req, res) {
    const inquiry = new inquiriesModel({ name: req.body.name, email: req.body.email, comment: req.body.comment });
    // Insert the inquiry into DB and redirect to acknowledgement page
    inquiry.save(function (err) {
        console.log(err);
        res.redirect('/view');
    });
});

/* GET view message page. */
router.get('/view', function (req, res) {
    res.render('view', { user: req.user });
});

module.exports = router;