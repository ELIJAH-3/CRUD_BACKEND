const createDatabaseQuery= 'CREATE DATABASE crud01;';
const createTableQuery = `CREATE TABLE crud01.student ( ID INT AUTO_INCREMENT PRIMARY KEY, NAME VARCHAR(100) NOT NULL, EMAIL VARCHAR(100) UNIQUE NOT NULL );`;
const insertDummyStudentQuery = `INSERT INTO crud01.student (NAME, EMAIL) VALUES ('Harry', 'Harry@mail.com'), ('Potter', 'Potter@mail.com');`;
const queryAllStudents= "SELECT * from student order by id asc";

module.exports= {
    createDatabaseQuery,
    createTableQuery,
    insertDummyStudentQuery,
    queryAllStudents,
}