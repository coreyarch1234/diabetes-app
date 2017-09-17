//Express
var express = require('express');
var exphbs  = require('express-handlebars');
//App
var app = express();
//To parse post requests
var bodyParser = require('body-parser');
//requests
var request = require('request');

//Nexmo
var Nexmo = require('nexmo');

var port = 3000;
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setting templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

var nexmo = new Nexmo({
  apiKey: 'cee7e560',
  apiSecret: '1394a4efa86a4e2c',
});
var from = '12012413493';
var to = '16462670978';
var text = 'A text message sent using the Nexmo SMS API';

console.log(nexmo);

nexmo.message.sendSms(from, to, text);

app.listen(process.env.PORT || port, function() {
    console.log("app is running");
    console.log("env port" + process.env.PORT);
})
