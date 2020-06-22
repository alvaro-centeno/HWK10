const inquirer = require("inquirer");

function rosterSeach() {
  inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to access?",
    choicdes: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees by Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "Exit",
    ]
  }).then(
    console.log(rosterSearch);
  )
};

module.exports = rosterSearch();
