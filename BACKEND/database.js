const log = require('./logger.js'); // using Winston logger for timestamp
const mysql = require("mysql");
const {createDatabaseQuery,createTableQuery, insertDummyStudentQuery }= require('./sqlQueries')
let db;
let retryCount = 0;
const maxRetries = 5; // Set the maximum number of retries
// const createTableQuery = `CREATE TABLE student ( ID INT AUTO_INCREMENT PRIMARY KEY, NAME VARCHAR(100) NOT NULL, EMAIL VARCHAR(100) UNIQUE NOT NULL );`;
// const insertDummyStudentQuery = `INSERT INTO student (NAME, EMAIL) VALUES ('Harry', 'Harry@mail.com'), ('Potter', 'Potter@mail.com');`;


function connectToDatabase() {
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "crud01",
    });

    db.connect(err => {
        if (err) {
            log.error(`DataBase.js Error connecting to DATABASE. ERROR= ${err}`);
            if (err.code === 'ER_BAD_DB_ERROR'){
                log.debug("Specified Database does not exit. Attempting to create dataBase");
                CreateDatabaseUsingTempDataBase()
                    .then(data => {
                        log.info("DataBase.js connectToDatabase: Database created.")
                    })
                    .catch(err => {
                        log.error("DataBase.js connectToDatabase: Could not create Database. ERROR - " + err)
                        return reject(err);
                    })
            }
            retryCount++;
            if (retryCount < maxRetries) {
                log.debug(`DataBase.js connectToDatabase: Retrying connection in 5 seconds... (Attempt ${retryCount} of ${maxRetries})`);
                setTimeout(connectToDatabase, 5000); // Retry connection after 5 seconds
            } else {
                log.error(`Maximum retry Attempt = ${maxRetries} reached. Could not connect to DATABASE.`);
                // process.exit(1);
            }
        } else {
            retryCount = 0;
            log.info(`connectToDatabase: Connected to DATABASE server.`);
        }
    });

    db.on('error', err => {
        log.error(`DATABASE error:`, err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            log.error(`DataBase.js Connection Lost with SQL SERVER. ERROR CODE=`, err.code);
            log.debug(`Attempting to reconnect to DATABASE server...`);
            connectToDatabase();
        } else {
            log.error(`DataBase.js UNKNOWN ERROR`);
            throw err;
        }
    });
};
function CreateDatabaseUsingTempDataBase() {
    log.debug("DataBase.js CreateDatabaseUsingTempDataBase().")
    return new Promise((resolve, reject) => {
        
        //Define a DB
        const tempDb = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
        });

        //Connect to the DB
        tempDb.connect(err => {
            if (err) {
                log.error(`DataBase.js Error connecting to tempDb.`);
                return reject(err);
            }
            log.info(`DataBase.js CreateDatabaseUsingTempDataBase: Connected to tempDb server.`);
        });

        // Execute create_Database Query
        tempDb.query(createDatabaseQuery, (err, data) => {
            log.debug("DataBase.js CreateDatabaseUsingTempDataBase: QUERY EXECUTED=" + createDatabaseQuery);
            if (err) {
                log.error("DataBase.js CreateDatabaseUsingTempDataBase: Could not create Database. ERROR=" + err.message)
                return reject(err);
            }
            log.debug(`DataBase.js CreateDatabaseUsingTempDataBase: RESULT: ${JSON.stringify(data, null, 2)}`);
        });
        log.debug(`DataBase.js CreateDatabaseUsingTempDataBase: Closing tempDb`);
        tempDb.end();
        return resolve("Database created");
    });
}
function CreateTableAndInsertDummy()
{
    log.debug("DataBase.js CreateTableAndInsertDummy().")
    return new Promise((resolve, reject) => {
        db.query(createTableQuery, (err, data) => {
            log.debug("DataBase.js CreateTableAndInsertDummy()- QUERY EXECUTED=" + createTableQuery);
            if (err) {
                log.error("DataBase.js CreateTableAndInsertDummy(). Could not create Table. ERROR=" + err.message)
                return reject(err);
            }
            log.debug(`DataBase.js CreateTableAndInsertDummy()-RESULT: ${JSON.stringify(data, null, 2)}`);
        });

        db.query(insertDummyStudentQuery, (err, data) => {
            log.debug("DataBase.js CreateTableAndInsertDummy()- QUERY EXECUTED=" + insertDummyStudentQuery);
            if (err) {
                log.error("DataBase.js CreateTableAndInsertDummy(). Could not insert values. ERROR=" + err.message)
                return reject(err);
            }
            log.debug(`DataBase.js CreateTableAndInsertDummy()-RESULT: ${JSON.stringify(data, null, 2)}`);
        });
        log.info("Table created. Dummy Values inserted.");
        return resolve("Table created. Dummy Values inserted.");
    });
}

//meant for SELECT QUERY
function executeSqlQuery(queryString) {
    log.debug("DataBase.js executeSqlQuery()-query: " + queryString)
    return new Promise((resolve, reject) => {

        db.query(queryString, (err, data) => {
            if (err) {
                log.error("DataBase.js executeSqlQuery() error during sql execution. ERROR=" + err.message)
                if(err.code === "ER_NO_SUCH_TABLE")
                {
                    CreateTableAndInsertDummy()
                        .then(data=> {
                            return  executeSqlQuery(queryString).then(resolve).catch(reject);
                        })
                        .catch(err => {
                            log.error("Could not create Table :( "+ err)
                            return reject (err);
                        })
                }
                
                return reject(err);
            }
            log.debug(`DataBase.js executeSqlQuery()-RESULT: ${JSON.stringify(data, null, 2)}`);
            return resolve(data)
        });
    });
}

//used for INSERT/UPDATE
function executeSqlQueryWithValues(queryString, values) {
    log.debug("DataBase.js executeSqlQueryWithValues()-query: " + queryString)
    return new Promise((resolve, reject) => {
        db.query(queryString,values, (err, data) => {
            if (err) {
                log.error("DataBase.js executeSqlQuery() error during sql execution. ERROR=" + err.message)
                return reject(err);
            }
            log.debug(`DataBase.js executeSqlQueryWithValues()-RESULT: ${JSON.stringify(data, null, 2)}`);
            return resolve(data)
        });
    });
}
module.exports = {
    connectToDatabase,
    executeSqlQuery,
    executeSqlQueryWithValues,
};