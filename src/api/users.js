var express = require('express');
var router = express.Router();
var EventEmitter = require('events');
const eventEmitter = new EventEmitter()
var nodemailer = require('nodemailer');
var controller = require("./../../controller/controller");
var jwt = require('jsonwebtoken');
var { alphabets } = require('../../data/alphabet');
var tokens = [];


function authChecker(req, res, next) {
    var header = req.headers.authorization || '';
    var token = header.split(/\s+/).pop() || ''
    var success = tokens.find(x => x == token);
    if (success) {
        next();
    } else {
        res.end('lütfen login olun');
    }
}
eventEmitter.on("send-email", (data) => {

    console.log(data.email)
    var mailOptions = {
        from: 'youremail@gmail.com',
        to: data.email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log();
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

router.get('/login', function (req, res) {
    controller.UsersMongoDBController.Users.login(req.query.email, req.query.password, function (err, result) {
        if (err) res.send(err);
        else {
            var token = jwt.sign({ info: result[0].EMAIL }, 'secretKey');
            tokens.push(token);
            res.send(token);
        }
    });
});

router.get('/my-profile', authChecker, function (req, res, next) {
    controller.UsersMongoDBController.Users.myProfile(req.query.email, function (err, result) {
        if (err) res.send(err);
        else {
            res.send(result[0].EMAIL);
        }
    });
});

router.post('/signup', function (req, res) {
    controller.UsersMongoDBController.Users.add(req.body, function (err, result) {
        if (err) res.send(err);
        else {
            eventEmitter.emit("send-email", { email: req.body.EMAIL });
            res.send(result);
        }

    });
});

router.get('/logout', function (req, res) {
    var header = req.headers.authorization || '';
    var token = header.split(/\s+/).pop() || ''
    const index = tokens.indexOf(token);
    if (index > -1) {
        tokens.splice(index, 1);
    }

    res.send("Çıkış başarılı");

});

router.get('/code', function (req, res) {
    let cnArr = [];
    let name = req.query.name;
    let chars = name.split('');
    let numberArr = [];
    chars.forEach(c => {
        var n = alphabets.find(x => x.char == c).number;
        numberArr.push(n);
    });
    var perm = numberArr.reduce(function permute(res, item, key, arr) {
        return res.concat(arr.length > 1 && arr.slice(0, key).concat(arr.slice(key + 1)).reduce(permute, []).map(function (perm) { return [item].concat(perm); }) || item);
    }, []);
    perm.forEach(item => {
        let cn = parseInt(item.toString().replace(/,/g, ''));
        cnArr.push(cn);
    });
    let bigNumbers = cnArr.filter(x => x > cnArr[0]).sort();
    var foundNumber = bigNumbers[0].toString();
    let foundNumberChars = foundNumber.split('')
    var result = '';
    foundNumberChars.forEach(fnc => {
        let c = alphabets.find(x => x.number == fnc).char;
        result = result + c;
    });
    res.send("sonuc: " + result);
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});



module.exports = router;