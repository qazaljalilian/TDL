const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {
    ObjectID
} = require('mongodb');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const {
    mongoose
} = require('./db/mongoose');
const {
    Todo
} = require('./models/todo');
const {
    User
} = require('./models/user');
var {
    authenticate
} = require('./middleware/authenticate');


var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials',true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(morgan('dev'));
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    resave: false,
    saveUninitialized: false,
    secret: 'heyyoustopthere',
    
}));
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});




////////////////////////////////////////////////////////
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});
/////////////////////////////////////////////////////////
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos
        });

    }, (e) => {
        res.status(400).send(e);
    });
});
////////////////////////////////////////////////////////////
app.get('/todos/:id', authenticate, (req, res) => {
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
});
////////////////////////////////////////////////////////////
app.delete('/todos/:id', authenticate, (req, res) => {
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
});
//////////////////////////////////////////////////////////////
app.patch('/todos/:id', authenticate, (req, res) => {
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
});
////////////////////////////////////////////////////////////
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        req.session.user = user._id;
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});
///////////////////////////////////////////////////////////////
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});
///////////////////////////////////////////////////////////////
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        req.session.user = user._id;
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});
//////////////////////////////////////////////////////////////
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, () => {
        res.status(400).send();
    });
});
////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
// app.get('/test',sessionChecker, function (req, res, next) {
//     res.send('hello');

// });
// app.get('/testlog',function(req,res){
//     req.session.user = '12345qazal'
//   res.send();
// })
///////////////////////////////////////////////////////////
app.listen(3000, () => {
    console.log('hi dear qazal im up');
});

module.exports = {
    app
};