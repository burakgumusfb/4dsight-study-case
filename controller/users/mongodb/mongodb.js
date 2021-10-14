var context = require('./../../../data/context');
var model = require('./../../../models/models');

class Users {
   
    static login(email,password, callback) {
        context.MongoDB.Repository.login(email,password, function (err, result) {
            callback(null, result);
        });
    }
    static myProfile(email, callback) {
        context.MongoDB.Repository.myProfile(email, function (err, result) {
            callback(null, result);
        });
    }
    static add(req, callback) {
        var users = new model.UsersModel.USERS(req.FULLNAME, req.EMAIL, req.PASSWORD);
        context.MongoDB.Repository.add(users, function (err, result) {
            callback(null, result);
        });
    }
}

module.exports =
    {
        Users: Users
    }