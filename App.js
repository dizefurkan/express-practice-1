var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsLayout = require('express-ejs-layouts');
var jwt = require('jsonwebtoken');

var Router = require('./src/router/Router');
var Database = require('./src/models/Database');
var Config = require('./src/models/Config');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './public/views/pages'));

app.use(function(req, res, next) {
    var isLogin = req.path === '/login'

    if (!isLogin) {
        var token = req.headers['token'];
        if (token) {
            var decoded = jwt.verify(token, Config.secretKey, function(err, data) {
                if (err) {
                    res.send({ success: false, message: 'TOKEN ERROR' });
                } else {
                    next();
                }
            });
        } else {
            res.status(403).render('Forbidden', {
                message: 'Please log in.',
                link: '/login',
                linkText: 'Go to Login Page'
            });
        }
    } else {
        next();
    }
});

app.use(ejsLayout);
Router(app);

app.listen(Config.port, function() {
    console.log('Server running at localhost:%s', Config.port);
});