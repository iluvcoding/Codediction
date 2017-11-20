var mongoose = require('mongoose');
var mySchema = mongoose.Schema({
	challenge:{
		type: String
	},
	user:{
		type: String
	},
	code:{
		type: String
	}
});

var Submission = module.exports = mongoose.model('logindb5', mySchema, 'Submission');

module.exports.storeCode = function(user, challenge, code, callback) {
	Submission.findOneAndUpdate({$and:[{user: user}, {challenge: challenge}]}, {user: user, challenge: challenge, code: code}, {upsert: true}, callback);
}

module.exports.findCode = function(user, challenge, callback) {
	Submission.find({$and: [{user: user}, {challenge: challenge}]}, callback);
}

module.exports.delSubmission = function(challenge, callback) {
	var query = {challenge: challenge};
	Submission.remove(query, callback);
}