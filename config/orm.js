const connection = require("./connection");

const viewStaff = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT
    e.id id,
    CONCAT_WS(" ", e.fName, e.lName) full_name,
    role.id role_id,
    role.title "Position",
    department.name "Dept",
    CONCAT('$', format(role.salary, 2)) salary,
    CONCAT_WS(" ", m.fName, m.lName) manager
    FROM employee e
    LEFT JOIN employee m ON m.id = e.mgr_id
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.dept_id = department.id
    ORDER BY e.id;
    `,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const listByDept = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
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
      `,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const listByMgr = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT
    CONCAT_WS(" ", m.fName, m.lName) manager,
    CONCAT_WS(" ", e.fName, e.lName) employee 
    FROM employee e
    INNER JOIN employee m ON e.mgr_id = m.id
    ORDER BY manager ASC;
    `,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const viewSNames = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT 
    id "ID No",
    CONCAT_WS(" ", fName, lName) full_name
    FROM employee;
    `,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const viewRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM role;`, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const newStaff = (obj) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO employee SET ?`, [obj], (err) => {
      if (err) {
        reject(err);
      }
      resolve({ msg: "Welcome the New Staff!" });
    });
  });
};

const changeRole = (empId, roleId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE employee SET ? WHERE ?`,
      [{ role_id: roleId }, { id: empId }],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ msg: "Role has been changed." });
        }
      }
    );
  });
};

const changeMgr = (empId, managerId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE employee SET ? WHERE ?`,
      [{ mgr_id: managerId }, { id: empId }],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ msg: "New Manager is SET" });
        }
      }
    );
  });
};

const removeStaff = (empId) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM employee WHERE ?`, [{ id: empId }], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ msg: "Let's hope its not a mistake!" });
      }
    });
  });
};

module.exports = {
  viewStaff,
  listByDept,
  listByMgr,
  viewSNames,
  viewRoles,
  newStaff,
  changeRole,
  changeMgr,
  removeStaff,
};
