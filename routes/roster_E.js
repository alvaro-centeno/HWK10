const inquirer = require("inquirer");
const {
  viewStaff,
  listByDept,
  listByMgr,
  viewRoles,
  viewDept,
  viewNames,
  addStaff,
  remStaff,
  upRole,
  upMgr,
  // viewEmployees,--
  // employeeByDept,--
  // employeeByManager,--
  // loadRoles,--
  // addNewEmployee,--
  // removeNewEmployee,--
  // updateEmployeeRole,--
  // updateEmployeeManager,
} = require("../config/orm");
const cTable = require("console.table");
const connection = require("../config/connection");
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
        "View ALL",
        "View By DEPT",
        "View By Manager",
        "New Staff",
        "Update Staff's Role",
        "Update Staff's MGR",
        "Remove Staff",
        "Exit",
      ],
    })
    .then((res) => {
      switch (res.mainMenu) {
        case "Exit":
          connection.end();
          process.exit();
        case "View ALL":
          viewStaff().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View By DEPT":
          listByDept().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View By Manager":
          listByMgr().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "New Staff":
          addEmployee().then((res) => {
            console.log(res);
            mainMenu();
          });
          break;
        case "Remove Staff":
          removeEmployee().then((res) => {
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
        case "Update Staff's MGR":
          updateManager().then((res) => {
            console.log(res);
            mainMenu();
          });
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
              name: "employees",
              type: "list",
              message: "Who is being removed?",
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
                  message: "What is their first name?",
                },
                {
                  name: "lName",
                  type: "input",
                  message: "What is their last name?",
                },
                {
                  name: "role",
                  type: "list",
                  message: "What is their role?",
                  choices: roles,
                },
                {
                  name: "manager",
                  type: "list",
                  message: "Whom shall they report to?",
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
                  name: "employees",
                  type: "list",
                  message: "Whom are we updating's role?",
                  choices: employees,
                },
                {
                  name: "roles",
                  type: "list",
                  message: "What are they going to be?",
                  choices: roles,
                },
              ])
              .then((res) => {
                viewStaff()
                  .then((data) => {
                    data.forEach((element) => {
                      if (res.role === element.title) {
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
              name: "employeed",
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
                  } else if (res.manager === "None") {
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
