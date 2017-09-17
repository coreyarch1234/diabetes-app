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
var Glucose = require('./models/glucose/glucose');

var glucoseArray = require('./glucose');

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

//Save glucose data to DB
function saveGlucoseLevels(glucoseInfo, callback){
    Glucose.findOne({_id: glucoseInfo._id}, function(err, glucose){
        if (glucose == null){
            Glucose.create(glucoseInfo, function(err, glucose){
                if (err) {
                    console.log(err);
                } else {
                    callback();
                }
            })
        }else{
            console.log("we found a duplicate link and we will stop creating");
        }
})
};

function resolveGlucoseLevels() {
    if (glucoseArray.length > 0 ) {
        return glucoseArray.pop();
    }
    return undefined;
}


function iterateGlucoseLevels(){
    var currentGlucoseLevel = resolveGlucoseLevels()
    if (currentGlucoseLevel != undefined){
        var glucoseInfo = {
            _id: currentGlucoseLevel._id,
            calculated_value: currentGlucoseLevel.calculated_value,
            timestamp: currentGlucoseLevel.timestamp
        }
        console.log(glucoseInfo);
        saveGlucoseLevels(glucoseInfo, function(){
            iterateGlucoseLevels();
        });
    }else{
        console.log("done saving");
        return
    }
}

app.get('/glucose', function(req, res){
    Glucose.find({}, function(err, glucoses){
        if (err){
            console.log(err);
        }else{
            res.send(glucoses);
        }
    })
})

//Get contact info from iOS and save it to db
app.get('/contact', function(req, res){
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
            Contact.findOne({name: "Corey"}, function(err, contact){
                if (contact != null){
                    nexmo.message.sendSms('12012413493', contact.number, 'You have received a text message from glycemic');
                }
            })
            res.send({status:"no more to save"});
        }
    })
});
//Post contact info from iOS and save it to db
app.post('/contact', function(req, res){
    console.log("req.body:" + req.body);
    console.log("req.body[0]:" + req.body[0]);
    console.log("req.body[0]:" + req.body[0]);
    console.log("req.body[0].name:" + req.body[0].name);
    console.log("req.body[0].number:" + req.body[0].name);
    console.log("req.body[1]:" + req.body[1]);
    console.log("req.body[1]:" + req.body[1]);
    console.log("req.body[1].name:" + req.body[1].name);
    console.log("req.body[1].number:" + req.body[1].name);
    var contactArray = req.body;
    Contact.cound({name:"Corey"}, function(err, count){
        if (count == 0){
            for (var i=0; i < contactArray.length; i++){
                var contactInfo = {
                    name: req.body[i].name,
                    number: req.body[i].number
                }
                Contact.create(contactInfo, function(err, contact){
                    if (err){
                        console.log(err);
                    }else{
                        console.log("contact saved successfully");
                        res.send(contact);
                    }
                });
            }
        }
    })
});

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


app.listen(process.env.PORT || port, function() {
    console.log("app is running");
    console.log("env port" + process.env.PORT);
    iterateGlucoseLevels();
})
