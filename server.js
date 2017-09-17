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

//all contacts
var allContacts = [];

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

//Get contact info from iOS and save it to db
app.get('/contact', function(req, res){
    // db.collections['contacts'].drop(function(err){
    //     if (err){
    //         console.log(err);
    //     }
    //     console.log('collection dropped');
    // });
    // var contactArray = [
    //     {
    //         name: "Corey",
    //         number: "16462670978"
    //     },
    //     {
    //         name: "Nabil",
    //         number: "16462670978"
    //     },
    //     {
    //         name: "Kadeem",
    //         number: "16462670978"
    //     }
    // ]
    // Contact.create(contactArray, function(err, contacts){
    //     if (err){
    //         console.log(err);
    //     }else{
    //         console.log("contacts saved successfully");
    //         console.log(contacts)
    //         res.send(contacts);
    //     }
    // });
});

//Post contact info from iOS and save it to db
app.post('/contact', function(req, res){
    console.log("req:" + req);
    // var name = req.name;
    // var number = req.number;
    // console.log("name: " + name);
    // console.log("number: " + number);
    // var contactInfo = {
    //     name: name,
    //     number: number
    // }
    // Contact.create(contactInfo, function(err, contact){
    //     if (err){
    //         console.log(err);
    //     }else{
    //         console.log("contact saved successfully");
    //         res.send(contact);
    //     }
    // });
});


//Send texts to contacts
// function removeNumber(allContacts){
//     if (allContacts.length > 0 ) {
//         return allContacts.pop();
//     }
//     return
// }
// setInterval(function()
// {
//     var nextNumber = removeNumber(allContacts);
//     nexmo.message.sendSms('12012413493', nextNumber, 'A text message sent using the Nexmo SMS API');
// }, 3000);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("database has successfully opened");
})



//Test Glucose Level Data to run through for alerts
// var glucoseArray = [];

app.listen(process.env.PORT || port, function() {
    console.log("app is running");
    console.log("env port" + process.env.PORT);
})
