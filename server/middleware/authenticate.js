// var {User}= require('./../models/user');
// var authenticate = (req, res, next) => {
//     var token = req.header('x-auth');
//     User.findByToken(token).then((user) => {
//         if (!user) {
//             return Promise.reject();
//         }
//         req.user = user;
//         req.token = token;
//         next();
//     }).catch((e) => {
//         res.status(401).send();
//     });
// };


// module.exports={authenticate};

var {
    User
} = require('./../models/user');
var authenticate = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        User.findById(req.session.user).then(user => {
            if (!user) {
                return Promise.reject();
            }
            req.user = user;
            next();
        }).catch((e)=>{
 res.status(401).send();

        })
    } else {
        res.status(401).send();
    }
};
module.exports = {
      authenticate
};