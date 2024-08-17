const createDatabaseQuery= 'CREATE DATABASE crud01;';
const createTableQuery = `CREATE TABLE CRUD01.STUDENT ( ID INT AUTO_INCREMENT PRIMARY KEY, NAME VARCHAR(100) NOT NULL, EMAIL VARCHAR(100) UNIQUE NOT NULL );`;
const insertDummyStudentQuery = `INSERT INTO CRUD01.STUDENT (NAME, EMAIL) VALUES ('HARRY', 'HARRY@mail.com'), ('POTTER', 'POTTER@mail.com');`;
const queryAllStudents= "SELECT * FROM STUDENT ORDER BY ID ASC";

module.exports= {
    createDatabaseQuery,
    createTableQuery,
    insertDummyStudentQuery,
    queryAllStudents,
}