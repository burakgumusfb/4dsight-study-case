var config = require('./../../../config/config');
var mongodb = require('mongodb');

class MongoDBRepository {


    static login(email, password, callback) {
        mongodb.MongoClient.connect(config.MongoDB.ConfiguratioManager.GET_CONNECTION_STRING, function (err, db) {
            db.collection("USERS").find({ "EMAIL": email, "PASSWORD": password }).toArray(function (err, result) {
                if (err)
                    callback(err, err);
                callback(null, result);
            });
            db.close();
        });
    }
    static myProfile(email, callback) {
        mongodb.MongoClient.connect(config.MongoDB.ConfiguratioManager.GET_CONNECTION_STRING, function (err, db) {
            db.collection("USERS").find({ "EMAIL": email}).toArray(function (err, result) {
                if (err)
                    callback(err, err);
                callback(null, result);
            });
            db.close();
        });
    }
    static add(model, callback) {
        mongodb.MongoClient.connect(config.MongoDB.ConfiguratioManager.GET_CONNECTION_STRING, function (err, db) {
            db.collection("USERS").insertOne(model, function (err, result) {
                if (err)
                    callback(err, err);
                callback(null, result);
            });
            db.close();
        });
    }

}
module.exports =
{
    Repository: MongoDBRepository
}

