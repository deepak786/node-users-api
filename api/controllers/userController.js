var mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	JWT = require('jsonwebtoken');

var self = module.exports = {

	create_user: function(req, res){
		if(!req.body.firstName){
			res.send({"status": 0, "message": "First Name is missing"});
			return;
		}
		if(!req.body.lastName){
			res.send({"status": 0, "message": "Last Name is missing"});
			return;
		}
		if(!req.body.email){
			res.send({"status": 0, "message": "Email is missing"});
			return;
		}
		if(!req.body.password){
			res.send({"status": 0, "message": "Password is missing"});
			return;
		}
		if(!req.body.phone){
			res.send({"status": 0, "message": "Phone is missing"});
			return;
		}
		if(!req.body.title){
			res.send({"status": 0, "message": "Title is missing"});
			return;
		}

		// check if email exists
		User.findOne({email: req.body.email}, function(err, result){
			if(err) return res.json({"status": 0, "message": err});
			if(result) return res.json({"status": 0, "message": "Email already exists"});
			
			// create a new user
			var user = new User(req.body);
			user.password = user.generateHash(user.password);
			console.log(user.password)
			user.save(function(err, user){
				if(err) return res.json({"status": 0, "message": err});
				res.json({"status" : 1, "message": "User registered successfully", "data":{"token": self.getToken(user)}});
			});
		});
	},

	login: function(req, res){
		if(!req.body.email){
			return res.send({"status": 0, "message": "Email is missing"});
		}

		if(!req.body.password){
			return res.send({"status": 0, "message": "Password is missing"});
		}
		User.findOne({email: req.body.email}, function(err, user){
			if(err) return res.json({"status": 0, "message": err});
			if(user){
				if(user.validPassword(req.body.password)){
					return res.json({"status" : 1, "message": "Login successfully", "data":{"token": self.getToken(user)}});
				}
			}
			res.json({"status": 0, "message": "Invalid details"});
		});
	},

	get_user: function(req, res){

	},

	update_user: function(req, res){

	},

	delete_user: function(req, res){

	},

	list_all_users: function(req, res){
		var user = req.user;
		if(user && user._id){
			console.log(user._id);
			User.find({_id: {$ne: user._id}}, function(err, users){
				if(err) return res.json({"status": 0, "message": err});
				return res.json(users);
			});
		}else{
			res.json({'status': 0, 'message': 'Invalid User'});
		}
	},

	getToken: function(user){
		return JWT.sign({email: user.email, _id: user._id}, process.env.JWT_SECRET);
	},

	check_header: function(req, res, next){
		if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]=='Bearer'){
			// decode the token
			var token = req.headers.authorization.split(' ')[1];
			JWT.verify(token, process.env.JWT_SECRET, function(err, decode){
				if(err){
					// invalid authorization
					return res.status(401).json({'status': 0, 'message': 'Invalid Authorization or token'});
				}
				req.user = decode;
				next();
			});
		}else{
			// missing authorization
			res.status(401).json({'status': 0, 'message': 'Missing Authorization'});
		}
	}
}


/*exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};




exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_task = function(req, res) {


  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};*/