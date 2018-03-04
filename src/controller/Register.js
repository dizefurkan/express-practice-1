var User = require('../models/Users');

module.exports.index = function(req, res) {
    res.render('Register', {
        pageTitle: 'Register'
    });
};

module.exports.submit = function(req, res, next) {
    if (req.body) {
        var userRegister = new User({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            password: req.body.password
        });
        
        userRegister.save(function(err) {
            if (err) {
                res.status(500).send('Register Duplicate Error');
                console.log('An error', err);
            }
            else {
                res.status(200).send("Register Successful");
                console.log('Register Successful');
                return next();
                res.redirect('/userlist');
            }
        });
    } else {
        console.log('req.body is empty');
        res.render('Register');
    }
};