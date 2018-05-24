var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');
const saltRounds = 10;

var userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	phone: String,
	title: String,
	createdAt: {
		type: Date,
		default: Date.now,
	}
});

// hash the password
userSchema.methods.generateHash = function(password) {
  	return bcrypt.hashSync(password, saltRounds);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users', userSchema);