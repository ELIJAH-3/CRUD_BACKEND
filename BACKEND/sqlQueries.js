const createDatabaseQuery = 'CREATE DATABASE excelsior;';
const createTableQuery = `CREATE TABLE excelsior.STUDENT ( ID INT AUTO_INCREMENT PRIMARY KEY, NAME VARCHAR(100) NOT NULL, EMAIL VARCHAR(100) UNIQUE NOT NULL );`;
const insertDummyStudentQuery = `INSERT INTO excelsior.STUDENT (NAME, EMAIL) VALUES ('HARRY', 'HARRY@mail.com'), ('POTTER', 'POTTER@mail.com');`;
const queryAllStudents = "SELECT * FROM STUDENT ORDER BY ID ASC;";
const deleteStudentbyId = "DELETE FROM STUDENT WHERE ID = ? ;";

module.exports = {
    createDatabaseQuery,
    createTableQuery,
    insertDummyStudentQuery,
    queryAllStudents,
    deleteStudentbyId
}