var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('config.json');
var multer = require('multer');
var querystring = require('querystring');

app.use(bodyParser.json());

app.use(express.static(__dirname + '/static/'));

Student = require('./models/Student');	// Student.js file for login info in login db
MCQ = require('./models/MCQ');			// MCQ.js file for mcqs in login db
McqTests = require('./models/McqTests');  // McqTests.js files which contains names of all tests
Challenge = require('./models/Challenge');  // Challenge.js file for coding questions
Submission = require('./models/Submission');	// Submission.js file for user codes

mongoose.connect(config.connectionString);	// config file where mongodb connection path is present
var db = mongoose.connection;
 
// Login
app.post('/login/', function(req, res) {
	var name = req.body.name;
	var passw = req.body.passw;
	Student.checkStudent(name, passw, function(err, student) {
		if(err) {
			throw err;
		}
		if(student != null) {
			console.log("Done!");
			res.send(true);
		}
		else {
			console.log("You are not registered");
			res.send(false);
		}
	});
});

// Register
app.post('/register', function(req, res) {
	var name = req.body.name;
	var passw = req.body.passw;
	var email = req.body.email;

	Student.findUser(name, function(err, student) {
		if(student == null) {
			Student.findEmail(email, function(err, student2) {
				if(student2 == null) {
					Student.addUser(name, passw, email, function(err, student3) {
						if(err) {
							throw err;
						}
						console.log("Registered!");
						res.send("done");
					});
				}
				else {
					res.send("email");
				}
			});
		}
		else {
			res.send("uname");
		}
	});
});

// Delete Account
app.post('/delAccount/', function(req, res) {
	var uname = req.body.userName;
	var pass = req.body.password;
	Student.checkStudent(uname, pass, function(err, student1) {
		if(err) {
			throw err;
		}
		if(student1 == null) {
			res.send("no");
		}
		else {
			Student.delStudent(uname, function(err, student2) {
				if(err) {
					throw err;
				}
				else {
					res.send("yes");
				}
			});
		}
	});
});

// Change Password
app.post('/changePass/', function(req, res) {
	var uname = req.body.userName;
	var oldPass = req.body.currPass;
	var newPass = req.body.nextPass;

	Student.checkStudent(uname, oldPass, function(err, student1) {
		if(err) {
			throw err;
		}
		if(student1 == null) {
			res.send("no");
		}
		else {
			Student.updatePass(uname, oldPass, newPass, function(err, student2) {
				if(err) {
					throw err;
				}
				else {
					res.send("yes");
				}
			});
		}
	});
});

// MCQs
app.post('/addQues/', function(req, res) {
	var ques = req.body.question;
	var options = req.body.options;
	var ans = req.body.answer;
	var topic = req.body.topic;
	var test = req.body.test;

	MCQ.addQues(ques, ans, options, topic, function(err, resp) {
		if(err) {
			throw err;
		}

		// Add test name to question
		if(test != null) {
			MCQ.addTest(ques, test, function(err, resp) {
				if(err) {
					throw err;
				}
			});
		}
		res.send("YES");
	});
});

// Delete Questions
app.post('/delQues/', function(req, res) {
	var quesArr = req.body.quesArr;
	for(i in quesArr) {
		MCQ.delQuestion(quesArr[i], function(err, resp) {
			if(err) {
				throw err;
			}
		});
	}
	res.send("Done");
});

// Get questions from db
app.post('/getQues/', function(req, res) {
	var topic = req.body.topics;
	MCQ.getQuestions(topic, function(err, ques) {
		if(err) {
			throw err;
		}
		res.send(ques);
	});
});

// Get all questions to show on sidebar
app.post('/sidebarQues/', function(req, res) {
	MCQ.getSidebar(function(err, ques) {
		if(err) {
			throw err;
		}
		res.send(ques);
	});
});

// Show test questions
app.post('/testQues/', function(req, res) {
	var quesArr = req.body.questions;
	var test = req.body.test;
	for(i in quesArr) {
		MCQ.addTest(quesArr[i], test, function(err, ques) {
			if(err) {
				throw err;
			}
		});
	}
	MCQ.getTestQues(test, function(err, ques) {
		if(err) {
			throw err;
		}
		res.send(ques);
	});
});

// Delete test questions
app.post('/delTestQues/', function(req, res) {
	var ques = req.body.ques;
	var test = req.body.test;

	MCQ.delTestQuestions(ques, test, function(err, ques) {
		if(err) {
			throw err;
		}
		res.send("Done");
	});
});

// Add test name to test collection
app.post('/addNewTest/', function(req, res) {
	var test = req.body.test;
	var time = req.body.time;

	McqTests.findTest(test, function(err, myTest) {
		if(err) {
			throw err;
		}
		if(myTest.length == 0) {
			console.log("Not found");
			McqTests.addNewTest(test, time, function(err, myTest1) {
				if(err) {
					throw err;
				}
				console.log("Added");
				res.send("Done");
			});
		}
		else {
			console.log("Found");
			console.log(myTest);
		}
	});
});

// Get test questions for test1.html
app.post('/showTest/', function(req, res) {
	var test = req.body.test;

	MCQ.showTestQues(test, function(err, myQues) {
		if(err) {
			throw err;
		}
		res.send(myQues);
	});
});

// Show test names on main.html
app.post('/testNames/', function(req, res) {
	McqTests.getTests(function(err, myTests) {
		if(err) {
			throw err;
		}
		res.send(myTests);
	});
});

// app.post('/getUserTestTime/', function(req, res) {
// 	var test = req.body.test;
// 	var name = req.body.user;

// 	McqTests.findUser(test, name, function(err, myTime1) {
// 		if(err) {
// 			throw err;
// 		}
// 		// If user never started the test
// 		if(myTime1.length == 0) {
// 			McqTests.getTime(test, function(err, myTime2) {
// 				if(err) {
// 					throw err;
// 				}
// 				// var retTime2 = myTime2[0].time;
// 				// console.log("Time2: " + retTime2);

// 				// console.log("Time2: " + myTime2);
// 				res.send(myTime2);
// 			});
// 		}
// 		else {
// 			// console.log("Time1: " + myTime1[0].users);
// 			res.send(myTime1[0].users);
// 		}
// 	});
// });

app.post('/getUserTestTime/', function(req, res) {
	var test = req.body.test;
	var name = req.body.user;

	McqTests.findUser(test, name, function(err, myTime1) {
 		if(err) {
 			throw err;
 		}
 		console.log("Time1: " + myTime1[0].users);
 		res.send(myTime1[0].users);
 	});
});

app.post('/getTestTime/', function(req, res) {
	var test = req.body.test;
	McqTests.getTime(test, function(err, myTime) {
		if(err) {
			throw err;
		}
		console.log("Test duration: " + myTime[0].time);
		res.send(myTime[0].time);
	});
});

// Update test time for Main.html
app.post('/updateTestTime/', function(req, res) {
	var test = req.body.test;
	var user = req.body.user;
	var time = req.body.time;

	McqTests.findUser(test, user, function(err, myUser1) {
		if(err) {
			throw err;
		}
		if(myUser1.length == 0) {
			console.log("User has not taken the test before");
			McqTests.setTime(test, user, time, function(err, myUser2) {
				if(err) {
					throw err;
				}
				res.send("Updated time");
			});
		}
		else {
			res.send("Already taken test");
		}
	});
});

// Store marks of test in db
app.post('/setTestmarks/', function(req, res) {
	var test = req.body.test;
	var user = req.body.user;
	var marks = req.body.marks;

	McqTests.setMarks(test, user, marks, function(err, myMarks) {
		if(err) {
			throw err;
		}
		res.send("Done");
	});
});

// Add coding questions
app.post('/addChallenge/', function(req, res) {
	var chall = req.body.challenge;
	var stat = req.body.statement;
	var ipFormat = req.body.ipFormat;
	var opFormat = req.body.opFormat;
	var constr = req.body.constraints;
	var topic = req.body.topic;
	var inputTC = req.body.inputTC;
	var outputTC = req.body.outputTC;

	Challenge.addNewChall(chall, stat, ipFormat, opFormat, constr, topic, inputTC, outputTC, function(err, resp) {
		if(err) {
			throw err;
		}
		res.send("Done");
	});
});

// Get coding page content
app.post('/getChallengeContent/', function(req, res) {
	var challenge = req.body.challenge;
	Challenge.getChallenge(challenge, function(err, resp) {
		if(err) {
			throw err;
		}
		res.send(resp);
	});
});

// Get names of coding questions
app.post('/getChallengeNames/', function(req, res) {
	var topic = req.body.topic;
	Challenge.findChallenge(topic, function(err, resp) {
		if(err) {
			throw err;
		}
		res.send(resp);
	});
});

// Save code to db
app.post('/saveCode/', function(req, res) {
	var user = req.body.user;
	var challenge = req.body.challenge;
	var code = req.body.code;

	Submission.storeCode(user, challenge, code, function(err, resp) {
		if(err)
			throw err;
		res.send("Done");
	});
});

// Get code saved by user
app.post('/getSubmission/', function(req, res) {
	var user = req.body.user;
	var challenge = req.body.challenge;

	Submission.findCode(user, challenge, function(err, resp) {
		if(err)
			throw err;
		if(resp.length != 0) {
			res.send(resp);
		}
		else {
			res.send("empty");
		}
	});
});

// Delete a challenge
app.post('/deleteChall/', function(req, res) {
	var challenge = req.body.challenge;

	Challenge.delChallenge(challenge, function(err, resp) {
		if(err)
			throw err;
		Submission.delSubmission(challenge, function(err, resp) {
			if(err)
				throw err;
			res.send("Deleted");
		});
	});
});

// app.get('/stack/', function(req, res) {
// 	var topic = "Stack";
// 	MCQ.getStackQues(topic, function(err, ques) {
// 		if(err) {
// 			throw err;
// 		}
// 		res.send(ques);
// 	});
// });

// app.get('/queue/', function(req, res) {
// 	var topic = "Queue";
// 	MCQ.getStackQues(topic, function(err, ques) {
// 		if(err) {
// 			throw err;
// 		}
// 		res.send(ques);
// 	});
// });

// app.get('/tree/', function(req, res) {
// 	var topic = "Trees";
// 	MCQ.getStackQues(topic, function(err, ques) {
// 		if(err) {
// 			throw err;
// 		}
// 		res.send(ques);
// 	});
// });

// app.get('/graph/', function(req, res) {
// 	var topic = "Graph";
// 	MCQ.getStackQues(topic, function(err, ques) {
// 		if(err) {
// 			throw err;
// 		}
// 		res.send(ques);
// 	});
// });

// app.get('/',function(req, res){
// 	res.send('hello world db path =  '+config.connectionString+ ' ' );

// });

// app.get('/student/', function(req,res){	// When url is /student
// 	console.log("in here");
// 	Student.getStudent(function(err,student){
// 		if(err){
// 			throw err;
// 		}
// 		console.log("in  too");
// 		res.send(student); 
// 	});
// });

// app.post('/student/', function(req,res){	// When url is /student
// 	console.log("in here");
// 	console.log(req.body.myval);
// 	Student.getStudent(function(err,student){
// 		if(err){
// 			throw err;
// 		}
// 		console.log("in  too");
// 		res.send(student); 
// 	});
// });

var server = app.listen('9090', function(){
	//console.log('running on port 9090 now');
	console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});

// Everything else
gettingSupportedLanguages();
codeChecker();
function codeChecker() {
  app.post('/code_checker', multer().single(), function(req, res, next) {
    var returnContent;
    var jsonToSend = querystring.stringify({
      'request_format': 'json',
      'source': req.body.code,
      'lang': req.body.language,
      'wait': false,
      'callback_url': '',
      'api_key': req.body.hackerRankApi,
      'testcases': req.body.testCases
    });    
    console.log("Submission:");
    console.log(req.body);
    var HRoptions = {
      hostname: 'api.hackerrank.com',
      port: 80,
      path: '/checker/submission.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(jsonToSend)
      }
    };
    var HRrequest = http.request(HRoptions, function(HRresponse) {
      HRresponse.setEncoding('utf8');
      HRresponse.on('data', function (data) {
        try {
          returnContent = data;
        } catch (e) {
          returnContent = "Error: " + e;
        }
      }).on('end', function () {
        console.log("==============================================================");
        console.log("Response:");
        console.log(JSON.parse(returnContent));
        res.json(JSON.parse(returnContent));
      });
    });
    HRrequest.on('error', function(e) {
      returnContent = "Error: " + e.message;
      res.json(returnContent);
    });
    HRrequest.write(jsonToSend);
    HRrequest.end();
  });
}

function gettingSupportedLanguages() {
  app.get('/supported_languages', function(req, res, next){
    var returnContent;
    var HRoptions = {
      hostname: 'api.hackerrank.com',
      port: 80,
      path: '/checker/languages.json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var HRrequest = http.request(HRoptions, function(HRresponse) {
      HRresponse.setEncoding('utf8');
      HRresponse.on('data', function (data) {
        try {
          returnContent = data;
        } catch (e) {
          returnContent = "Error: " + e;
        }
      });
      HRresponse.on('end', function () {
        res.json(JSON.parse(returnContent));
      });
    });
    HRrequest.on('error', function(e) {
      returnContent = "Error: " + e.message;
      res.json(returnContent);
    });
    HRrequest.write(""); // --> important for initiating request, sending empty string.
    HRrequest.end();
  });
}
