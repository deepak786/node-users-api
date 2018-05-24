var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
  	User = require('./api/models/userModel'), //created model loading here
  	bodyParser = require('body-parser');

// load env configuration
require('dotenv').config();
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://"+process.env.host+"/"+process.env.db); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.route('/')
	.all(function(req, res){
		res.send('WELCOME ');
	});


var routes = require('./api/routes/userRoutes'); //importing route
routes(app); //register the route


app.listen(port);

console.log('users RESTful API server started on: ' + port);