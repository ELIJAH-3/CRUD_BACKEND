const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const log = require('./logger'); // using Winston logger for timestamp
const app = express();

app.use(express.json());
app.use(cors());
let db;
let retryCount = 0;
const maxRetries = 5; // Set the maximum number of retries

function connectToDatabase() {
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "crud01",
    });

    db.connect(err => {
        if (err) {
            log.error(`server.js Error connecting to DATABASE`);
            if (err.code === 'ER_BAD_DB_ERROR')
                log.error("Specified Database does not exit.")
            retryCount++;
            if (retryCount < maxRetries) {
                log.debug(`server.js Retrying connection in 5 seconds... (Attempt ${retryCount} of ${maxRetries})`);
                setTimeout(connectToDatabase, 5000); // Retry connection after 5 seconds
            } else {
                log.error(`Maximum retry Attempt = ${maxRetries} reached. Could not connect to DATABASE.`);
                process.exit(1);
            }
        } else {
            retryCount = 0;
            log.info(`Connected to DATABASE server.`);
        }
    });

    db.on('error', err => {
        log.error(`DATABASE error:`, err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            log.error(`server.js Connection Lost with SQL SERVER. ERROR CODE=`, err.code);
            log.debug(`Attempting to reconnect to DATABASE server...`);
            connectToDatabase();
        } else {
            log.error(`server.js UNKNOWN ERROR`);
            throw err;
        }
    });
};

connectToDatabase();

let isDebugEnabled = true;


app.get("/", (req, res) => {
    const sqlQueryString = "SELECT * from student order by id desc";
    log.debug(`server.js Querying all Students.`);
    // if (db.state !== 'connected') {
    //     log.error(`server.js Database not connected.`);
    //     return res.status(500).json({ error: "Database not connected" });
    // }
    db.query(sqlQueryString, (err, data) => {
        if (err){
            log.error("server.js got error during sql execution. ERROR=" + err.message)
            return res.json(err);
        }
        if (isDebugEnabled) {
            log.debug(`server.js Query:`, sqlQueryString);
            data.forEach(elements => {
                log.debug(`server.js Result:`, elements);
            });
        }
        return res.json(data); // sends Response
    })
    // res.json("Hello from backend");
})

app.post('/createNewStudent', (req, res) => {
    log.debug(`server.js Entered Create New Student with name=` + req.body.name + ", email=" + req.body.email);
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

app.post('/runsqlquery', (req, res) => {
    log.debug(`server.js ` + ", queryString=" + req.body.queryString);
    const sqlQueryString = req.body.queryString;

    db.query(sqlQueryString, (err, data) => {
        if (err) {
            log.debug(`server.js error while executing query: `, req.body.queryString);
            log.debug(`server.js ERROR: `, err.message);
            return res.json(err)
        };

        if (isDebugEnabled) {
            log.debug(`server.js Query:`, sqlQueryString);
            log.debug(`server.js Result:`, data);
        }
        return res.json(data); // sends Response
    })

    // res.json("Hello from backend");
})

app.listen(8081, () => {
    log.info(`server.js listening to 8081`);
    // run command "node server.js" to start the server
})