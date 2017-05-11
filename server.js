var express = require('express');
var app = express();
var bebop = require('node-bebop');
var client = bebop.createClient();
var port = 3030;
var unirest = require('unirest');

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST,Delete");
    next();
});

app.get('/', function (request, response) {
    response.status(200);
});
app.get('/takeoff', function (request, response) {
    client.connect(function () {
        client.takeOff();

        setTimeout(function () {
            client.land();
        }, 5000);
    });
    console.log("Taking off...");

    response.status(200).json({
        landed: true
    });
});
app.get('/execute', function (request, response) {

    client.connect(function () {
        client.takeOff();

        setTimeout(function () {
            client.right(10);
        }, 3000);

        setTimeout(function () {
            client.stop();
        }, 4000);

        setTimeout(function () {
            client.left(10);
        }, 5000);

        setTimeout(function () {
            client.stop();
        }, 6000);

        setTimeout(function () {
            client.land();
        }, 7000);
    });

    response.status(200).json({
        landed: true
    });
});
app.post('/userLocation', function (request, response) {
    console.log('connected');
    client.connect(function () {
        client.takeOff();
        setTimeout(function () {
            client.GPSSettings.resetHome();
            client.WifiSettings.outdoorSetting(1);
        }, 5000);
        setTimeout(function () {
            client.forward(100);
        }, 5000);
        setTimeout(function () {
            client.land();
        }, 5000);
    });

    response.status(200).json({
        landed: true
    });
});
/*
app.post('/gpsLocation', function(request, response) {
   console.log('connected');
   client.connect(function() {
       setTimeout(function() {
           client.GPSSettings.sendControllerGPS({
               latitude: 20,
               longitude: 10,
               altitude: 10,
               horizontalAccuracy: -1,
               verticalAccuracy: -1
           });
          
       }, 5000);
       
   }); 

    response.status(200).json({
        landed: true
    });
}); */
app.post('/faceRecognition', function (request, response) {
    console.log('connected');
    client.connect(function () {
        client.MediaRecord.pictureV2();
        unirest.post("https://lambda-face-recognition.p.mashape.com/album")
            .header("X-Mashape-Key", "<required>")
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", "application/json")
            .send("album=USERS")
            .end(function (result) {

            });
    });

    response.status(200).json({
        landed: true
    });
});
app.post('/droneState', function (request, response) {
    console.log('connected');
    var battery, landed, takingOff;
    client.connect(function () {

        client.on("battery", function (data) {
            battery = data;
        });

        client.on("landed", function () {
            landed = data;
        });

        client.on("takingOff", function () {
            takingOff = data;
        });

    });

    response.status(200).json({
        landed: landed,
        battery: battery,
        takingOff: takingOff
    });
});
app.post('/takePhoto', function (request, response) {
    console.log('connected');
    client.connect(function () {
        client.MediaRecord.pictureV2();
    });

    response.status(200).json({
        landed: landed,
        battery: battery,
        takingOff: takingOff
    });
});

app.listen(port);
console.log('Node.js express server started on port %s', port);