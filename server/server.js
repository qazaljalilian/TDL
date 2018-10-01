const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const bcrypt = require('bcryptjs');
var RedisStore = require('connect-redis')(session);





const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('./db/mongoose');
const {
    Todo
} = require('./models/todo');
const {
    User
} = require('./models/user');




var app = express();


var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(morgan('dev'));
app.use(allowCrossDomain);
app.use(bodyParser.json());

app.use(session({
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379
    }),
    secret: 'hey you',
    resave: false,
    saveUninitialized: false,
    key: 'user_sid',
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    User.findById(id, function (err, user) {
        cb(err, user);
    });
});


const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
    },
    function (username, password, done) {
        User.findOne({
            email: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }
));

app.get('/tester', (req, res) => {
    res.send();
})

///////////////////////////////////////////////////////
app.post('/todos', (req, res) => {
    if (req.isAuthenticated()) {
        var todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
        });
        todo.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(401).send();
    }

});
/////////////////////////////////////////////////////////
app.get('/todos', (req, res) => {
    if (req.isAuthenticated()) {
        Todo.find({
            _creator: req.user._id
        }).then((todos) => {
            res.send({
                todos
            });

        }, (e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(401).send();
    }

});
////////////////////////////////////////////////////////////
app.get('/todos/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({
                todo
            });
        });
    } else {
        res.status(401).send();
    }


});
////////////////////////////////////////////////////////////
app.delete('/todos/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send(todo);
        }).catch((e) => {
            res.status(400).send();
        });
    } else {
        res.status(401).send();
    }

});
//////////////////////////////////////////////////////////////
app.patch('/todos/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        var body = _.pick(req.body, ['text']);
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
            $set: body
        }, {
            new: true
        }).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({
                todo
            });
        }).catch((e) => {
            res.status(400).send();
        });



    } else {
        res.status(401).send();
    }

});
// ////////////////////////////////////////////////////////////
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        passport.authenticate('local')(req, res, function () {
            res.send();
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});
///////////////////////////////////////////////////////////////
app.get('/users/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user)

    } else {
        res.status(401).send();
    }
});
///////////////////////////////////////////////////////////////
app.post('/users/login', passport.authenticate('local'), (req, res) => {
    res.send();
});
//////////////////////////////////////////////////////////////
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send();
});
////////////////////////////////////////////////////////////




app.post('/teste', passport.authenticate('local'),
    function (req, res) {
        res.send('ok');
    });


app.post('/testee', function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user)
    } else {
        res.status(401).send();
    }
});

///////////////////////////////////////////////////////////
app.listen(3000, () => {
    console.log('Hi dear Qazal I\'m up');
});

module.exports = {
    app
};