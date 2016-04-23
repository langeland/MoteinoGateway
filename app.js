//var sqlite3 = require('sqlite3').verbose();
var serialport = require("serialport");
var fs = require('fs');
var uuid = require('uuid');

var db = new sqlite3.Database('gateway.db');



var SerialPort = new serialport.SerialPort(process.argv[2], {
	baudrate: 115200,
	parser: serialport.parsers.readline("\r\n")
});


SerialPort.on('open', function(){
	console.log('Serial Port Opend');
	
	fs.writeFile("Transmission.log", "Serial Port Opend", function(err) {
            if(err) {
                        return console.log(err);
                    }
                });

	SerialPort.on('data', function(data){
		
		console.log(data);

		fs.writeFile("Transmission.log", data, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		});

		// guid, datetime, NetworkId, SenderNodeId, data
		db.run("CREATE TABLE if not exists receivedData (guid TEXT, eventType TEXT, datetime TEXT, networkId TEXT, senderNodeId TEXT, data TEXT)");

		var prepare = db.prepare("INSERT INTO received_data VALUES (?,?,?,?,?,?)");
		prepare.run(
			uuid.v4(),
			"eventType",
			new Date(),
			'networkId',
			'senderNodeId',
			data
			);
		prepare.finalize();
	});
});


