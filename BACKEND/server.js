const express = require("express");
const cors = require("cors");
const log = require('./logger'); // using Winston logger for timestamp
const database = require('./DataBase'); 
const app = express();
const {queryAllStudents, deleteStudentbyId }= require('./sqlQueries')

app.use(express.json());
app.use(cors());
let isDebugEnabled = true;

app.get("/homepage", (req, res) => {
    //Will be called from Frontend
    log.debug(`server.js Querying all Students.`);
    database.executeSqlQuery(queryAllStudents)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })

    // db.query(sqlQueryString, (err, data) => {
    //     if (err){
    //         log.error("server.js got error during sql execution. ERROR=" + err.message)
    //         return res.json(err);
    //     }
    //     if (isDebugEnabled) {
    //         log.debug(`server.js Query:`, sqlQueryString);
    //         data.forEach(elements => {
    //             log.debug(`server.js Result:`, elements);
    //         });
    //     }
    //     return res.json(data); // sends Response
    // })
})

app.post('/createNewStudent', (req, res) => {
    log.debug(`server.js Entered Create New Student with name=` + req.body.name + ", email=" + req.body.email);
    const sqlQueryString = "INSERT INTO student (`NAME`, `EMAIL`) VALUES (?)";
    const values = [req.body.name,req.body.email]
    database.executeSqlQueryWithValues(sqlQueryString, [values])
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })

    // db.query(sqlQueryString, [values], (err, data) => {
    //     if (err) return res.json(err);
    //     return res.json(data);
    // })
})
app.put('/updateExistingStudent/:id', (req, res) => {
    log.debug(`server.js Entered updateExistingStudent with name=` + req.body.name + ", email=" + req.body.email);
    const sqlQueryString = "UPDATE student SET NAME = ?, EMAIl = ? WHERE ID = ?";
    const values = [req.body.name,req.body.email, req.params.id]
    database.executeSqlQueryWithValues(sqlQueryString, values)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })
})

app.delete('/deleteStudent/:id', (req, res) => {
    log.debug(`server.js Entered deleteStudent with id=` + req.params.id);
    const values = [req.params.id]
    database.executeSqlQueryWithValues(deleteStudentbyId, values)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })
})
app.post('/runsqlquery', (req, res) => {
    log.debug(`server.js ` + ", queryString=" + req.body.queryString);
    const sqlQueryString = req.body.queryString;

    /*
    let prefix = "INSERT INTO student (`NAME`, `EMAIL`) VALUES (?)";
    let userName = "A1";
    let userEmail = "A1@mail.com"
    

    for (let i = 1; i < 100000; i++) {
        userName=i;
        const values = [userName, userEmail]
        database.executeSqlQueryWithValues(prefix, [values])
            .then(data => {
                log.error(`DataBase.js ABHIJEET K: RESULT: ${JSON.stringify(data, null, 2)}`);
            })
            .catch(err => {
                log.error(`DataBase.js ABHIJEET: Query not executed`);
            })
    }*/
    database.executeSqlQuery(sqlQueryString)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })
})

app.listen(8081, () => {
    log.info(`server.js listening to 8081`);
    // run command "node server.js" to start the server
})

database.connectToDatabase();