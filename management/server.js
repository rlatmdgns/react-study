const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const fs = require("fs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//data
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

const multer = require("multer");
const upload = multer({ dest: "./upload" });

app.use("/image", express.static("upload"));

app.get("/api/customers", (req, res) => {
  connection.query(
    "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
    (err, rows, fields) => {
      res.send(rows);
      console.log(rows);
    }
  );
});

app.post("/api/customers", upload.single("image"), (req, res) => {
  let sql = "INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, 0)";
  let image = "/image/" + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  console.log(image);
  console.log(name);
  console.log(birthday);
  console.log(gender);
  console.log(job);

  let params = [image, name, birthday, gender, job];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
    console.log(err);
    console.log(rows);
  });
});

app.delete("/api/customers/:id", (req, res) => {
  let sql = "UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?";
  let params = [req.params.id];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});
app.listen(port, () => console.log(port));
// [
//   {
//     id: "1",
//     image: "https://placeimg.com/64/64/1",
//     name: "홍동",
//     birthday: "940317",
//     gender: "남자",
//     job: "학생",
//   },
//   {
//     id: "2",
//     image: "https://placeimg.com/64/64/2",
//     name: "길동",
//     birthday: "940317",
//     gender: "남자",
//     job: "학생",
//   },
//   {
//     id: "3",
//     image: "https://placeimg.com/64/64/3",
//     name: "홍길동",
//     birthday: "940317",
//     gender: "남자",
//     job: "학생",
//   },
// ]
