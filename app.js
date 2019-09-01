const express = require('express');
const app = express();
const fs = require('fs'); // required for writing/reading from files
const chromeExe = require('chrome-launcher'); // required for launching chrome

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log('Example app listening on port 4000!'));

//
// TASK 2 
//
const request = require("request");

var options = {
    method: 'GET',
    url: 'http://localhost:3000/api/device/configuration'
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    if (body) {
        fs.writeFile('./cache.json', body, err => {
            if (err) throw new Error(err);
            console.log('Successfully wrote file');
        });
    } else console.log("Object missing, nothing to write!");
});

//
// TASK 3
//

function getFileData() {
    var fileData = fs.readFileSync('./cache.json', 'utf8');
    return fileData;
}

app.get("/api/configuration", serveData);

function serveData(req, res) {
    res.send(JSON.parse(getFileData()));
}

//
// TASK 4
//
app.get("/api/start_application", handleStartApp);

function handleStartApp(req, res) {
    const data = JSON.parse(getFileData());
    const url = data.displays[0].applications[0].url;
    chromeExe.launch({
        startingUrl: url,
        ignoreDefaultFlags: true
    });
}

//
// TASK 5
//

var socketClient = require("socket.io-client")("http://localhost:3001");

var processID = 0;
const ps = require('ps-node');

socketClient.on("state", function (data) {

    if (data.data) {
        const fileData = JSON.parse(getFileData());
        const fileUrl = fileData.displays[0].applications[0].url;
        const socketDataUrl = data.data.displays[0].applications[0].url;

        if (socketDataUrl !== fileUrl) {

            if (processID != 0) {
                ps.kill(processID, function (err) {
                    if (err) console.log(err)
                });
            }
            chromeExe.launch({
                startingUrl: socketDataUrl
            }).then(process => {
                processID = process.pid;
            }).catch(err => console.log(err));
        }
    }
});


