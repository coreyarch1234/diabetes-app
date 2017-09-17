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
var allNumbers = [];

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
    var contactArray = [
        {
            name: "Corey",
            number: "16462670978"
        },
        {
            name: "Nabil",
            number: "16462670978"
        },
        {
            name: "Kadeem",
            number: "16462670978"
        }
    ]
    Contact.count({name:"Corey"}, function(err, count){
        console.log("count: " + count);
        if (count == 0){
            for (var i=0; i < contactArray.length; i++){
                // allNumbers.push(contactArray[i].number);
                Contact.create(contactArray[i], function(err, contact){
                    if (err){
                        console.log(err);
                    }else{
                        console.log("contact saved successfully");
                        res.send(contact);
                    }
                });
            }
        }else{
            res.send(status:"no more to save");
        }
    })
});
//Post contact info from iOS and save it to db
// app.post('/contact', function(req, res){
//     db.collections['contacts'].drop(function(err){
//         if (err){
//             console.log(err);
//         }
//         console.log('collection dropped');
//     });
//     console.log("req.body:" + req.body);
//     console.log("req.body[0]:" + req.body[0]);
//     console.log("req.body[0]:" + req.body[0]);
//     console.log("req.body[0].name:" + req.body[0].name);
//     console.log("req.body[0].number:" + req.body[0].name);
//     console.log("req.body[1]:" + req.body[1]);
//     console.log("req.body[1]:" + req.body[1]);
//     console.log("req.body[1].name:" + req.body[1].name);
//     console.log("req.body[1].number:" + req.body[1].name);
//     var contactArray = req.body;
//     for (var i=0; i < contactArray.length; i++){
//         var contactInfo = {
//             name: req.body[i].name,
//             number: req.body[i].number
//         }
//         allNumbers.push(req.body[i].number);
//         Contact.create(contactInfo, function(err, contact){
//             if (err){
//                 console.log(err);
//             }else{
//                 console.log("contact saved successfully");
//                 res.send(contact);
//             }
//         });
//     }
// });

//Send texts to contacts
function removeNumber(allNumbers){
    if (allNumbers.length > 0 ) {
        return allNumbers.pop();
    }
    return
}
function sendMessages(){
    setInterval(function()
    {
        var nextNumber = removeNumber(allNumbers);
        nexmo.message.sendSms('12012413493', nextNumber, 'You have received a text message from glycemic');
    }, 3000);
}

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("database has successfully opened");
    Contact.findOne({name: "Corey"}, function(err, contact){
        if (contact != null){
            nexmo.message.sendSms('12012413493', contact.number, 'You have received a text message from glycemic');
        }
    })
})



//Test Glucose Level Data to run through for alerts
// var glucoseArray = [];

app.listen(process.env.PORT || port, function() {
    console.log("app is running");
    console.log("env port" + process.env.PORT);
    // Contact.findOne({name: "Corey"}, function(err, contact){
    //     nexmo.message.sendSms('12012413493', contact.number, 'You have received a text message from glycemic');
    // })
})
