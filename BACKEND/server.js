const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud01",
})

app.get("/", (req, res) => {
    const sqlQueryString = "SELECT * from student order by NAME desc";
    db.query(sqlQueryString, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
    // res.json("Hello from backend");
})

app.post('/createNewStudent', (req, res) => {
    console.log("Entered Create New Student with name=" + req.body.name + ", email=" + req.body.email);
    const sqlQueryString = "INSERT INTO student (`NAME`, `EMAIL`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email
    ]
    db.query(sqlQueryString, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
    // res.json("Hello from backend");
})

app.listen(8081, () => {
    console.log("listening to 8081");
    // run command "node server.js" to start the server
})
