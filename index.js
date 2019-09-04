const express = require("express");
const app = express();
const port = 3000;

const URLS = [
  "https://nsoft.com",
  "https://klix.ba",
  "https://bljesak.info",
  "https://expressjs.com",
  "https://spark.ba"
];
var DEV_CONF = {
  hostname: "DESKTOP-XVG1415",
  motherbord: "Asus-Realtek",
  hdd: "SATA-XDG871263",
  network: "Realtek",
  ip_address: "172.20.15.88",
  displays: [
    {
      id: 1,
      refresh_rate: "60Hz",
      manufacturer: "DELL",
      applications: [
        {
          name: "Spectator",
          runtime: "chrome.exe",
          url: "https://nsoft.com"
        }
      ]
    }
  ]
};

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/device/configuration", handleConfig);

function handleConfig(req, res) {

  res.send(generateResponseBody());
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateResponseBody() {
  DEV_CONF.displays[0].applications[0].url = URLS[getRandomInt(0, URLS.length - 1)];

  if (getRandomInt(0, 100) < 20) {
    return null;
  }
  else {
    return DEV_CONF;
  }
}

var io = require("socket.io")();

io.listen(3001);

io.on("connection", function (socket) {
  console.log("a user connected");
});

setInterval(function () {
  io.emit("state", { data: generateResponseBody() });
}, 5000);

var socketClient = require("socket.io-client")("http://localhost:3001");

socketClient.on("connect", function (data) {
  console.log("Test Client successfully connected.");
});

socketClient.on("state", function (data) {
  console.log("data");
  console.log(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
