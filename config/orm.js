const allStaff = `
SELECT 
employee.id AS 'Staff ID', 
employee.fName AS 'First Name', 
employee.lName AS 'Last Name',
role.title AS 'Position', 
department.name AS 'Department', 
CONCAT('$', FORMAT(role.salary, 2)) AS 'Salary',
CONCAT_WS(" ", E.fName, E.lName) AS 'Manager Name'
FROM employee 
  INNER JOIN role 
      ON (employee.role_id = role.id)
  INNER JOIN department
      ON (role.dept_id = department.id)
  LEFT JOIN employee E
      ON (employee.mgr_id = E.id)
ORDER BY employee.id;
`;

const allDept = `SELECT name AS Departments FROM department`;

const allRoles = `SELECT title AS Roles FROM role`;

const addStaff = `INSERT INTO employee SET ?`;

const addDept = `INSERT INTO department SET ?`;

const addRole = `INSERT INTO role SET ?`;

const editStaff = `UPDATE employee SET ? WHERE ?`;

const stfFN = `SELECT CONCAT_WS(" ", fName, lName) AS "Full Name" FROM employee`;

const staffDept = `
SELECT 
CONCAT_WS(" ", employee.fName, employee.lName) AS 'Department Staff'
FROM employee
LEFT JOIN role
  ON (employee.role_id = role.id)
LEFT JOIN department
  on (role.dept_id = department.id)
WHERE department.id = ?
`;

const staffMgr = `
SELECT 
CONCAT_WS(" ", employee.fName, employee.lName) AS Staff
FROM employee
LEFT JOIN employee E
  on (employee.mgr_id = E.id)
WHERE employee.mgr_id = ?
`;

const budget = `
SELECT 
department.name AS Department, 
CONCAT('$', FORMAT(SUM(salary),2)) AS 'Budget Utilized'
FROM employee
  INNER JOIN role
	  on employee.role_id = role.id
  INNER JOIN department
	  on role.dept_id = department.id
WHERE department.name = ?;
`;

const delStaff = `DELETE FROM employee WHERE ?`;

const delDept = `DELETE FROM department WHERE ?`;

const delRole = `DELETE FROM role WHERE ?`;

module.exports = {
  allStaff,
  allDept,
  allRoles,
  addStaff,
  addDept,
  addRole,
  editStaff,
  stfFN,
  staffDept,
  staffMgr,
  budget,
  delStaff,
  delDept,
  delRole,
};
