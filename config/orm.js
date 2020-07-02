const connection = require("./connection");

const viewStaff = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT
      e.id "ID #",
      CONCAT_WS(" ", e.fName, e.lName) "Full Name",
      roles.title "Position",
      department.name "Department",
      CONCAT('$', format(roles.salary, 2)) "Base Salary",
      CONCAT_WS(" ", m.fName, m.lName) "Manager"
    FROM employee e
    LEFT JOIN employee m ON m.id = e.mgr_id
    LEFT JOIN roles ON e.role_id = roles.id
    LEFT JOIN department ON roles.dept_id = department.id
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
      e.id "ID #",
      CONCAT_WS(" ", e.fName, e.lName) "Full Name",
      title "Title",
      department.name "Department"
    FROM employee e
    LEFT JOIN roles
    ON e.role_id = roles.id
    LEFT JOIN department
    ON roles.dept_id = department.id
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
      e.id "ID #",
      CONCAT_WS(" ", e.fName, e.lName) "Full Name",
      CONCAT_WS(" ", m.fName, m.lName) "Manager"
      FROM employee e
      LEFT JOIN employee m ON m.id = e.mgr_id
      ORDER BY Manager DESC;
      `,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const viewDept = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM department;`, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const viewNames = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM employee;`, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const viewRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM roles;`, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const addStaff = (obj) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO employee SET ?`, [obj], (err) => {
      if (err) {
        reject(err);
      }
      resolve({ msg: "New Staff Added!" });
    });
  });
};

const remStaff = (empId) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM employee WHERE ?`, [{ id: empId }], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ msg: "Removed Selected Staff!" });
      }
    });
  });
};

const upRole = (empId, roleId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE employee SET ? WHERE ?`,
      [{ role_id: roleId }, { id: empId }],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ msg: "Staff Updated Info!" });
        }
      }
    );
  });
};

const upMgr = (empId, managerId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE employee SET ? WHERE ?`,
      [{ mgr_id: managerId }, { id: empId }],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ msg: "Staff's change Manager!" });
        }
      }
    );
  });
};

module.exports = {
  viewStaff,
  listByDept,
  listByMgr,
  viewRoles,
  addStaff,
  remStaff,
  upRole,
  upMgr,
};
