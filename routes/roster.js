const inquirer = require("inquirer");
const connection = require("../config/connection");
const cTable = require("console.table");
const {
  viewStaff,
  listByDept,
  listByMgr,
  viewRoles,
  addStaff,
  remStaff,
  upRole,
  upMgr,
} = require("../config/orm");

let roles = [];
let employees = [];
let newEmployee = {};
let roleID;
let managerID;
let employeeID;

const mainMenu = () => {
  inquirer
    .prompt({
      name: "mainMenu",
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View all Employees",
        "View Staff by DEPT",
        "View Staff by MGR",
        "Add a New Staff",
        "Update Staff's Role",
        "Update Staff's Manager",
        "Remove a Staff",
        "Exit",
      ],
    })
    .then((res) => {
      switch (res.mainMenu) {
        case "View all Employees":
          viewStaff().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View Staff by DEPT":
          listByDept().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View Staff by MGR":
          listByMgr().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "Add a New Staff":
          addEmployee().then((res) => {
            console.log(res);
            mainMenu();
          });
          break;
        case "Update Staff's Role":
          updateRole().then((res) => {
            console.log(res);
            mainMenu();
          });
          break;
        case "Update Staff's Manager":
          updateManager().then((res) => {
            console.log(res);
            mainMenu();
          });
          break;
        case "Remove a Staff":
          removeEmployee().then((res) => {
            console.log(res);
            mainMenu();
          });
          break;
        case "Exit":
          connection.end();
          process.exit();
          break;
      }
    });
};

const removeEmployee = () => {
  employees = [];
  return new Promise((resolve, reject) => {
    viewStaff()
      .then((res) => {
        res.forEach((el) => {
          employees.push(el.full_name);
        });
      })
      .then(() => {
        inquirer
          .prompt([
            {
              name: "employee",
              type: "list",
              message: "Which staff is getting terminated?",
              choices: employees,
            },
          ])
          .then((res) => {
            viewStaff()
              .then((data) => {
                data.forEach((element) => {
                  if (res.employee === element.full_name) {
                    employeeID = element.id;
                  }
                });
              })
              .then(() => {
                remStaff(employeeID).then((resp) => resolve(resp));
              });
          });
      })
      .catch((err) => {
        if (err) reject(err);
      });
  });
};

const addEmployee = () => {
  employees = [];
  roles = [];
  return new Promise((resolve, reject) => {
    viewRoles()
      .then((res) => {
        res.forEach((element) => {
          roles.push(element.title);
        });
      })
      .then(() => {
        viewStaff()
          .then((res) => {
            res.forEach((el) => {
              employees.push(el.full_name);
            });
          })
          .then(() => {
            inquirer
              .prompt([
                {
                  name: "fName",
                  type: "input",
                  message: "Staff's First Name?",
                },
                {
                  name: "lName",
                  type: "input",
                  message: "Staff's Last Name?",
                },
                {
                  name: "role",
                  type: "list",
                  message: "Staff's Role?",
                  choices: roles,
                },
                {
                  name: "manager",
                  type: "list",
                  message: "Staff's Manager?",
                  choices: employees,
                },
              ])
              .then((res) => {
                viewStaff()
                  .then((data) => {
                    data.forEach((element) => {
                      if (res.roles === element.title) {
                        roleID = element.role_id;
                      }
                      if (res.manager === element.full_name) {
                        managerID = element.id;
                      } else if (res.manager === "None") {
                        managerID = null;
                      }
                    });
                  })
                  .then(() => {
                    newEmployee = {
                      fName: res.fName,
                      lName: res.lName,
                      role_id: roleID,
                      mgr_id: managerID,
                    };
                    return newEmployee;
                  })
                  .then((obj) => {
                    addStaff(obj).then((resp) => resolve(resp));
                  });
              });
          });
      })
      .catch((err) => {
        if (err) reject(err);
      });
  });
};

const updateRole = () => {
  employees = [];
  roles = [];
  return new Promise((resolve, reject) => {
    viewRoles()
      .then((res) => {
        res.forEach((element) => {
          roles.push(element.title);
        });
      })
      .then(() => {
        viewStaff()
          .then((res) => {
            res.forEach((el) => {
              employees.push(el.full_name);
            });
          })
          .then(() => {
            inquirer
              .prompt([
                {
                  name: "employee",
                  type: "list",
                  message: "Which staff's role needs an update?",
                  choices: employees,
                },
                {
                  name: "role",
                  type: "list",
                  message: "What's their new role?",
                  choices: roles,
                },
              ])
              .then((res) => {
                viewStaff()
                  .then((data) => {
                    data.forEach((element) => {
                      if (res.roles === element.title) {
                        roleID = element.role_id;
                      }
                      if (res.employee === element.full_name) {
                        employeeID = element.id;
                      } else if (res.manager === "None") {
                        employeeID = null;
                      }
                    });
                  })
                  .then(() => {
                    upRole(employeeID, roleID).then((resp) => resolve(resp));
                  });
              });
          });
      })
      .catch((err) => {
        if (err) reject(err);
      });
  });
};

const updateManager = () => {
  employee = [];
  return new Promise((resolve, reject) => {
    viewStaff()
      .then((res) => {
        res.forEach((el) => {
          employee.push(el.full_name);
        });
      })
      .then(() => {
        inquirer
          .prompt([
            {
              name: "employee",
              type: "list",
              message: "Which employee you want to update?",
              choices: employees,
            },
            {
              name: "manager",
              type: "list",
              message: "Who is the new manager of the employee?",
              choices: employees,
            },
          ])
          .then((res) => {
            viewStaff()
              .then((data) => {
                data.forEach((element) => {
                  if (res.manager === element.full_name) {
                    managerID = element.id;
                  }
                  if (res.employee === element.full_name) {
                    employeeID = element.id;
                  } else if (res.manager === "") {
                    employeeID = null;
                  }
                });
              })
              .then(() => {
                upMgr(employeeID, managerID).then((resp) => resolve(resp));
              });
          });
      })
      .catch((err) => {
        if (err) reject(err);
      });
  });
};
module.exports = mainMenu;
