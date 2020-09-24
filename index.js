const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, orgval) => {
  let temperture = tempval.replace("{%tempval%}", orgval.main.temp);
  temperture = temperture.replace("{%tempmin%}", orgval.main.temp_min);
  temperture = temperture.replace("{%tempmax%}", orgval.main.temp_max);
  temperture = temperture.replace("{%location%}", orgval.name);
  temperture = temperture.replace("{%country%}", orgval.sys.country);
  temperture = temperture.replace("{%tempstatus%}", orgval.weather[0].main);
  
  return temperture;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=rajkot&appid=f1f312dbb83145ec37cb63bd43d5d6ae"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];

        // console.log(arrData[0].main.temp);

        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err)
          return console.log("Connection closed due to error occured", err);

        res.end();
      });
  }
});
server.listen(3000, "127.0.0.1");
