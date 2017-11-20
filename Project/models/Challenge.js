var mongoose = require('mongoose');
var mySchema = mongoose.Schema({
	challenge:{
		type: String
	},
	statement:{
		type: String
	},
	inputFormat:{
		type: String
	},
	outputFormat:{
		type: String
	},
	constraints:{
		type: String
	},
	topic:{
		type: String
	},
	inputTC:{
		type: [String]
	},
	outputTC:{
		type: [String]
	}
});

var Challenge = module.exports = mongoose.model('logindb3', mySchema, 'Challenge');

module.exports.addNewChall = function(chall, stat, ip, op, constr, topic, ipTC, opTC, callback) {
	var query = {
		challenge: chall,
		statement: stat,
		inputFormat: ip,
		outputFormat: op,
		constraints: constr,
		topic: topic,
		inputTC: ipTC,
		outputTC: opTC
	};
	Challenge.create(query, callback);
}

module.exports.getChallenge = function(challenge, callback) {
	var query = {challenge: challenge};
	Challenge.find(query, callback);
}

module.exports.findChallenge = function(topic, callback) {
	var query = {topic: topic};
	Challenge.find(query, callback);
}

module.exports.delChallenge = function(challenge, callback) {
	var query = {challenge: challenge};
	Challenge.remove(query, callback);
}