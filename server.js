//Express
var express = require('express');
var exphbs  = require('express-handlebars');
//App
var app = express();
//To parse post requests
var bodyParser = require('body-parser');
//requests
var request = require('request');

var mongodb = require("mongodb");
// Setting up Database
var mongoose = require('mongoose');

//Contact Schema
var Contact = require('./models/contact/contact');

//Nexmo
var Nexmo = require('nexmo');

var nexmo = new Nexmo({
  apiKey: 'cee7e560',
  apiSecret: '1394a4efa86a4e2c',
});

var port = 3000;

// Use bluebird
mongoose.Promise = require('bluebird');
// assert.equal(query.exec().constructor, require('bluebird'));
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/diabetes-app', {
  useMongoClient: true,
  /* other options */
});


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setting templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

//Post contact info from iOS and save it to db
app.get('/contact', function(req, res){
    var name = req.name;
    var number = req.number;
    var contactInfo = {
        name: "Corey",
        number: "16462670978"
    }
    Contact.create(contactInfo, function(err, contact){
        if (err){
            console.log(err);
        }else{
            console.log("contact saved successfully");
            res.send(contact);
        }
    });
});

//Send texts to contacts
function readContacts(){
    Contact.find({}, function(err, contacts){
        if (err){
            console.log(err);
        }else{
            for (var i = 0; i < contacts.length; i++){
                var from = '12012413493';
                var to = contacts[i].number;
                var text = 'Alert. Eat food.';
                setInterval(function(){nexmo.message.sendSms(from, to, text); }, 3000);
            }
        }
    })
}

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("database has successfully opened");
})

// function sendMessagesToContacts(contact){
//     var from = '12012413493';
//     var to = contact.number;
//     var text = 'Alert. Eat food.';
//     nexmo.message.sendSms(from, to, text);
// }
// numbers = ['16462670978','16462670978','16462670978'];
// function sendMessagesToContacts(number, callback){
//     var from = '12012413493';
//     var to = number;
//     var text = 'A text message sent using the Nexmo SMS API';
//     nexmo.message.sendSms(from, to, text, function(something){
//         console.log(something);
//     });
// }
// function readContacts(function(number){
//     sendMessagesToContacts
//
// });

// for (var i = 0; i < numbers.length; i++){
//     var from = '12012413493';
//     var to = numbers[i];
//     var text = 'A text message sent using the Nexmo SMS API';
//     // console.log(nexmo);
//     // nexmo.message.sendSms(from, to, text);
//     setInterval(function(){nexmo.message.sendSms(from, to, text); }, 3000);
//
//     }

// function removeNumber(numbers){
//     if (numbers.length > 0 ) {
//         return numbers.pop();
//     }
//     return
// }
// setInterval(function()
// {
//     var nextNumber = removeNumber(numbers)
//     nexmo.message.sendSms('12012413493', nextNumber, 'A text message sent using the Nexmo SMS API');
// }, 3000);


//Test Glucose Level Data to run through for alerts
// var glucoseArray = [];

app.listen(process.env.PORT || port, function() {
    console.log("app is running");
    console.log("env port" + process.env.PORT);
})
