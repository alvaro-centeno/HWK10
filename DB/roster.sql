DROP DATABASE IF EXISTS roster_db;
CREATE database roster_db;
USE roster_db;

CREATE TABLE department (
   id INT NOT NULL AUTO_INCREMENT,
   name VARCHAR (30) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE role (
   id INT NOT NULL AUTO_INCREMENT,
   title VARCHAR (30) NOT NULL,
   salary DECIMAL (8,2) NOT NULL,
   dept_id INT NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE employee (
   id INT NOT NULL AUTO_INCREMENT,
   fName VARCHAR (30) NOT NULL,
   lName VARCHAR (30) NOT NULL,
   role_id INT NOT NULL,
   mgr_id INT,
   PRIMARY KEY (id)
);

-- Basic Views
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
SELECT fName, id FROM employee WHERE id = 2;

-- UPDATE
UPDATE employee SET mgr_id = 7 WHERE id = 8;

-- DELETE
DELETE FROM employee WHERE id = 16;

-- View ALL STAFF by Dept ID
SELECT 
  employee.id, 
  fName, 
  lName,
  title, 
  department.name
FROM employee LEFT JOIN role
ON employee.role_id = role.id
LEFT JOIN department
ON role.dept_id = department.id
ORDER BY department.id ASC;

-- View ALL STAFF by Manager
SELECT e.id `ID #`,
    CONCAT_WS(" ", e.fName, e.lName) `Full Name`,
    CONCAT_WS(" ", m.fName, m.lName) `Manager`
FROM
    employee e
LEFT JOIN employee m ON m.id = e.mgr_id
ORDER BY
    Manager DESC;


-- View ALL STAFF By ID
SELECT
    e.id `ID #`,
    CONCAT_WS(" ", e.fName, e.lName) `Full Name`,
    roles.title `Position`,
    department.name `Department`,
    CONCAT_WS(" ", m.fName, m.lName) `Manager`
FROM
    employee e
LEFT JOIN employee m ON m.id = e.mgr_id
LEFT JOIN roles ON e.role_id = roles.id
LEFT JOIN department ON roles.dept_id = department.id
ORDER BY e.id;

SELECT 
id "ID No",
CONCAT_WS(" ", fName, lName) "Staff Name"
FROM employee;

-- View All Salary
SELECT 
CONCAT('$', format(SUM(salary), 2)) `Total Budget`
FROM role;

SELECT CONCAT_WS(" ", fName, lName) AS "Full Name" FROM employee;