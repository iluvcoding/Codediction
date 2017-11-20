var mongoose = require('mongoose');
var quesSchema = mongoose.Schema({
	question:{
		type: String
	},
	answer:{
		type: String
	},
	options:{
		type: [String]
	},
	topic:{
		type: String
	},
	tests:{
		type: [String]
	}
});

var MCQ = module.exports = mongoose.model('logindb2', quesSchema, 'MCQ');

module.exports.addQues = function(question, answer, options, topic, callback) {
	var query = {question: question, answer: answer, options: options, topic: topic};
	MCQ.create(query, callback);
}

module.exports.getQuestions = function(topic, callback) {
	var query = {topic: topic};
	MCQ.find(query, callback);
}

module.exports.delQuestion = function(question, callback) {
	var query = {question: question};
	MCQ.remove(query, callback);
}

module.exports.addTest = function(question, test, callback) {
	MCQ.update({question: question}, {$push: {tests: test}}, {upsert: true}, callback);
}

module.exports.getSidebar = function(callback) {
	MCQ.find({}, "question", callback);
}

module.exports.getTestQues = function(test, callback) {
	MCQ.find({tests: test}, "question", callback);
}

module.exports.delTestQuestions = function(question, test, callback) {
	MCQ.update({question: question}, {$pull: {tests: test}}, callback);
}

module.exports.showTestQues = function(test, callback) {
	MCQ.find({tests: test}, callback);
}