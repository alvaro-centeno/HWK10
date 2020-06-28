const connection = require("../Assets/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const mainMenu = async () => {
  await inquirer
    .prompt([
      {
        name: "mainMenu",
        message: "What would you like to access:",
        type: "list",
        choices: [
          "View Database",
          "Add to Database",
          "Update Database",
          "Delete from Database",
          "Utilized Budget",
          "Exit",
        ],
      },
    ])
    .then(async (res) => {
      switch (res.mainMenu) {
        case "View Database":
          viewCompany();
          break;

        case "Add to Database":
          switch (res) {
            case "department":
              break;
            case "roles":
              break;
            case "employee":
              break;
            case "Main Menu":
              mainMenu();
              break;
          }
          break;

        //Delete Items from Database
        case "Update Database":
          switch (resToUpdate) {
            case "Department":
              break;

            case "Roles":
              break;

            case "Employee":
              break;

            case "Main Menu":
              mainMenu();
              break;
          }
          break;

        //Delete Items from Database
        case "Delete from Database":
          break;

        //Salary Sum
        case "Utilized Budget":
          salary().then((allSalary) => {
            let objSalary = [];
            let tSalary = 0;
            for (let i = 0; i < allSalary.length; i++) {
              if (typeof allSalary[i].salary === "number") {
                objSalary.push(allSalary[i].salary);
              }
            }
            for (let i = 0; i < objSalary.length; i++) {
              tSalary += objSalary[i];
            }
            console.log(formatter.format(tSalary), "USD");
            mainMenu();
          });
          break;

        //Closed App
        case "Exit":
          connection.end();
          process.exit();
          break;
      }
    });
};

async function viewCompany() {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "view",
        message: "View Company Database:",
        choices: ["Department", "Roles", "Employee", "All by Id"],
      },
    ])
    .then((res) => {
      let result = res.view;
      readAllCompany(result).then((res) => {
        const table = cTable.getTable(res);
        console.log(table);
        mainMenu();
      });
    });
}

const readAllCompany = (result) => {
  return new Promise((resolve, reject) => {
    if (result === "Department") {
      connection.query(`SELECT id, deptName FROM ${result} `, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    } else if (result === "Roles") {
      connection.query(`SELECT dept_id, title FROM ${result} `, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    } else if (result === "Employee") {
      connection.query(
        `SELECT fName, lName, role_id, mgr_id FROM ${result} `,
        (err, data) => {
          err ? reject(err) : resolve(data);
        }
      );
    } else {
      connection.query(
        `
        SELECT employee.id, employee.fName, employee.lName, roles.title, department.deptName, roles.salary
        FROM department RIGHT JOIN employee
        ON department.id = employee.role_id
        LEFT JOIN roles
        ON roles.id= employee.role_id;
        `,
        (err, data) => {
          err ? reject(err) : resolve(data);
        }
      );
    }
  });
};

const salary = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM roles", (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

module.exports = mainMenu;
