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

INSERT INTO department (name) VALUES ("Operations");
INSERT INTO department (name) VALUES ("Executives");
INSERT INTO department (name) VALUES ("Project Management");
INSERT INTO department (name) VALUES ("Engineering");

INSERT INTO role (title, salary, dept_id) VALUES ("Foreman", 180000, 1);
INSERT INTO role (title, salary, dept_id) VALUES ("Journeyman", 160000, 1);
INSERT INTO role (title, salary, dept_id) VALUES ("Apprentice", 82000, 1);
INSERT INTO role (title, salary, dept_id) VALUES ("Vice President", 250000, 2);
INSERT INTO role (title, salary, dept_id) VALUES ("General Manager", 220000, 2);
INSERT INTO role (title, salary, dept_id) VALUES ("Superintendent", 200000, 1);
INSERT INTO role (title, salary, dept_id) VALUES ("Sr Project Manager", 120000, 3);
INSERT INTO role (title, salary, dept_id) VALUES ("Project Manager", 100000, 3);
INSERT INTO role (title, salary, dept_id) VALUES ("Project Engineer", 75000, 3);
INSERT INTO role (title, salary, dept_id) VALUES ("Engineering Manager", 180000, 4);
INSERT INTO role (title, salary, dept_id) VALUES ("Design Engineer", 80000, 4);
INSERT INTO role (title, salary, dept_id) VALUES ("Detailer", 120000, 4);

INSERT INTO employee (fName, lName, role_id, mgr_id) VALUES ("David", "Anthony", 1, 1);
INSERT INTO employee (fName, lName, role_id) VALUES ("Frank", "Fuffy", 2);
INSERT INTO employee (fName, lName, role_id) VALUES ("Bart", "Simpson", 2);
INSERT INTO employee (fName, lName, role_id) VALUES ("Robert", "Schmitz", 3);
INSERT INTO employee (fName, lName, role_id) VALUES ("Adam", "Lamb", 3);
INSERT INTO employee (fName, lName, role_id, mgr_id) VALUES ("Larry", "Jimbo", 4, 1);
INSERT INTO employee (fName, lName, role_id, mgr_id) VALUES ("Emily", "Shell", 5, 1);
INSERT INTO employee (fName, lName, role_id, mgr_id) VALUES ("Mick", "Lorenzo", 6, 1);
INSERT INTO employee (fName, lName, role_id) VALUES ("Peter", "Panelli", 7);
INSERT INTO employee (fName, lName, role_id) VALUES ("Keenv", "Gordon", 8);
INSERT INTO employee (fName, lName, role_id) VALUES ("Morpheus", "Reno", 8);
INSERT INTO employee (fName, lName, role_id) VALUES ("Peter", "Griffin", 9);
INSERT INTO employee (fName, lName, role_id, mgr_id) VALUES ("Gavin", "Tart", 10, 1);
INSERT INTO employee (fName, lName, role_id) VALUES ("Quinton", "Zee", 11);
INSERT INTO employee (fName, lName, role_id) VALUES ("Hailey", "Bambino", 12);
INSERT INTO employee (fName, lName, role_id) VALUES ("Leehom", "Park", 12);

-- views
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
SELECT fName, id FROM employee WHERE id = 2;

-- updates
UPDATE employee SET mgr_id = 7 WHERE id = 8;

-- delete
DELETE FROM employee WHERE id = 16;


-- View employees by department
SELECT 
	e.id `ID #`,
    CONCAT_WS(" ", e.fName, e.lName) `Full Name`,
	title `Title`, 
	department.name `Department`
FROM employee e
LEFT JOIN roles
ON e.role_id = roles.id
LEFT JOIN department
ON roles.dept_id = department.id
ORDER BY department.id ASC;

-- View Employees by Manager
SELECT e.id `ID #`,
    CONCAT_WS(" ", e.fName, e.lName) `Full Name`,
    CONCAT_WS(" ", m.fName, m.lName) `Manager`
FROM
    employee e
LEFT JOIN employee m ON m.id = e.mgr_id
ORDER BY
    Manager DESC;


-- View all Employees
SELECT
    e.id `ID #`,
    CONCAT_WS(" ", e.fName, e.lName) `Full Name`,
    roles.title `Position`,
    department.name `Department`,
	CONCAT('$', format(roles.salary, 2)) `Base Salary`,
    CONCAT_WS(" ", m.fName, m.lName) `Manager`
FROM
    employee e
LEFT JOIN employee m ON m.id = e.mgr_id
LEFT JOIN roles ON e.role_id = roles.id
LEFT JOIN department ON roles.dept_id = department.id
ORDER BY e.id;
