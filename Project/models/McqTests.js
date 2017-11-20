var mongoose = require('mongoose');
var testSchema = mongoose.Schema({
	test: {
		type: String
	},
	time: {
		type: String
	},
	users: [{
		name: String,
		time: String,
		marks: String	
	}]
});

var McqTests = module.exports = mongoose.model('testModel', testSchema, 'McqTests');

module.exports.findTest = function(test, callback) {
	McqTests.find({test: test}, callback);
}

module.exports.addNewTest = function(test, time, callback) {
	// McqTests.update({id: "1"}, {$push: {test: test}}, {upsert: true}, callback);
	McqTests.create({test: test, time: time, users: []}, callback);
}

module.exports.getTests = function(callback) {
	McqTests.find(callback);
}

module.exports.findUser = function(test, name, callback) {
	// McqTests.find({$and: [{test: test}, {"users.name": name}]}, callback);
	McqTests.find({$and:[{test: test}, {'users': { $elemMatch: {'name': name}}}]}, callback);
}

module.exports.getTime = function(test, callback) {
	McqTests.find({	test: test}, callback);
}

module.exports.setTime = function(test, name, time, callback) {
	McqTests.update({test: test}, {$push: {users: {name: name, time: time}}}, callback);
}

module.exports.setMarks = function(test, name, marks, callback) {
	McqTests.update({test: test, "users.name": name}, {"users.$.marks": marks}, {upsert: true}, callback);
}