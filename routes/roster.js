const inquirer = require("inquirer");
const cTable = require("console.table");
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const connection = require("../config/connection");
const {
  viewStaff,
  listByDept,
  listByMgr,
  viewSNames,
  viewRoles,
  newStaff,
  changeRole,
  changeMgr,
  removeStaff,
} = require("../config/orm");

let roles = [];
let employees = [];
let newStaffList = {};
let roleID;
let managerID;
let staffID;

const mainMenu = () => {
  inquirer
    .prompt({
      name: "mainMenu",
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View it ALL",
        "View BY DEPT",
        "View By MGR",
        "View Staff Names",
        "View Utilized Budget",
        "New Staff",
        "Update Staff's Role",
        "Update Staff's Manager",
        "Remove a Staff",
        "Exit",
      ],
    })
    .then((res) => {
      switch (res.mainMenu) {
        case "View it ALL":
          viewStaff().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View BY DEPT":
          listByDept().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View By MGR":
          listByMgr().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View Staff Names":
          viewSNames().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;
        case "View Utilized Budget":
          salary().then((res) => {
            console.table(res);
            mainMenu();
          });
          break;

        case "New Staff":
          addStaff().then((res) => {
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
          removeAStaff().then((res) => {
            console.log(res);
            mainMenu();
          });
          break;
        case "Exit":
          connection.end();
          process.exit();
      }
    });
};

const removeAStaff = () => {
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
              message: "Which employee you want to remove?",
              choices: employees,
            },
          ])
          .then((res) => {
            viewStaff()
              .then((data) => {
                data.forEach((element) => {
                  if (res.employee === element.full_name) {
                    staffID = element.id;
                  }
                });
              })
              .then(() => {
                removeStaff(staffID).then((resp) => resolve(resp));
              });
          });
      })
      .catch((err) => {
        if (err) reject(err);
      });
  });
};

const salary = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT 
      CONCAT('$', format(SUM(salary), 2)) "Total Budget"
      FROM role
      `,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const addStaff = () => {
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
                  message: "What is their first name?",
                  type: "input",
                },
                {
                  name: "lName",
                  message: "What is their last name?",
                  type: "input",
                },
                {
                  name: "role",
                  message: "What is their role?",
                  type: "list",
                  choices: roles,
                },
                {
                  name: "manager",
                  message: "Whom shall they report to?",
                  type: "list",
                  choices: employees,
                },
              ])
              .then((res) => {
                viewStaff()
                  .then((data) => {
                    data.forEach((element) => {
                      if (res.role === element.title) {
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
                    newStaffList = {
                      fName: res.fName,
                      lName: res.lName,
                      role_id: roleID,
                      mgr_id: managerID,
                    };
                    return newStaffList;
                  })
                  .then((obj) => {
                    newStaff(obj).then((resp) => resolve(resp));
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
                  message: "Who's role is to be updated?",
                  type: "list",
                  choices: employees,
                },
                {
                  name: "role",
                  message: "What is their new role?",
                  type: "list",
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
                        staffID = element.id;
                      } else if (res.manager === "None") {
                        staffID = null;
                      }
                    });
                  })
                  .then(() => {
                    changeRole(staffID, roleID).then((resp) => resolve(resp));
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
              name: "employee",
              message: "Which staff request manager change?",
              type: "list",
              choices: employees,
            },
            {
              name: "manager",
              message: "Whom shall they report to now?",
              type: "list",
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
                    staffID = element.id;
                  } else if (res.manager === "None") {
                    staffID = null;
                  }
                });
              })
              .then(() => {
                changeMgr(staffID, managerID).then((resp) => resolve(resp));
              });
          });
      })
      .catch((err) => {
        if (err) reject(err);
      });
  });
};

module.exports = mainMenu;
