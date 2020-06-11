const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// options = {
//   key: fs.readFileSync("/afs/apd.pok.ibm.com/u/zunym/eclipz.key"),
//   cert: fs.readFileSync("/afs/apd.pok.ibm.com/u/zunym/eclipz.crt"),
// };
// http service
var port = 3128;

// function readJSONFile(filename, callback) {
//   fs.readFile(filename, function (err, data) {
//     if (err) {
//       callback(err);
//       return;
//     }
//     try {
//       callback(null, JSON.parse(data));
//     } catch (exception) {
//       callback(exception);
//     }
//   });
// }

// readJSONFile("./data/selfreporting.json", function (err, json) {
//   if (err) {
//     throw err;
//   }
//   console.log(json);
// });

// app.get("/test", (req, res) => {
//   // res.setHeader("Access-Control-Allow-Origin", "https://zunym.github.io/apiserver/");
//   res.send(readJSONFile());
// });

const dataPath = "./data/selfreporting.json";

// READ
app.get("/data", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    res.send(JSON.parse(data));
  });
});

app.get("/hello", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://zunym.github.io/apiserver/"
  );
  // res.send("hello world");
  res.json({ message: "hello world" });
});

app.post("/status", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://zunym.github.io/apiserver/"
  );
  const date = req.body.date;
  const time = req.body.time;
  const system_name = req.body.system_name;
  const value = date + " " + time;
  console.log(value, system_name);

  function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }
  jsonReader("./data/selfreporting.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const message = data[value];
    const system_detect = message["system"];
    const messages_return = message["messages"];
    if (system_name == system_detect) {
      console.log("Detect " + system_detect, messages_return);
      res.send(
        `${req.body.system_name} ${req.body.date} ${req.body.time}<br/><p>${messages_return}</p> <a href="/"><br/>Back</a>`
      );
    } else {
      console.log("Try Again");
      res.send(
        `Sorry! Either system name and date is wrong to query information, try again! <br/> <a href="/"><br/>Back</a>`
      );
    }
  });
});

app.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://zunym.github.io/apiserver/"
  );
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile("./index.html", null, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.write("File Not Found");
    } else {
      res.write(data);
    }
    res.end();
  });
});

// https
//   .createServer(options, app)
//   .listen(port, () => console.log(`Server app listening on port ${port}!`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
