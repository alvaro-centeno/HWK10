DROP DATABASE IF EXISTS roster_db;
CREATE DATABASE roster_db;
USE roster_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(8,2) NOT NULL,
  dept_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  fName VARCHAR(30) NOT NULL,
  lName VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  mgr_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO todos(text)
VALUES ("Mysql programmers get a lot of money");

INSERT INTO todos(text)
VALUES ("finish the course");

INSERT INTO todos(text)
VALUES ("have fun");

-- view all todos
SELECT * FROM todos;
SELECT text, id FROM todos WHERE completed = false;

-- view single todo
SELECT * FROM todos
WHERE id = 2;

-- update todos
UPDATE todos 
SET text = "Live life"
WHERE id = 3;
UPDATE todos 
SET completed = true
WHERE id = 3;

-- delete a todo
DELETE FROM todos WHERE id = 2;