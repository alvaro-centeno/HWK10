const connection = require("../config/connection");
const queries = require(`../config/orm`);

const roleList = [];
const staffList = [];
const deptList = [];
const staffIds = [];
const departmentIds = [];
const roleIds = [];

function initPrompts() {
  updateInfo(getDatabaseInfo);
}

function fillArr(arr, table, col, res) {
  arr.length = 0;

  for (table of res) {
    arr.push(table[col]);
  }

  if (arr === staffIds || arr === departmentIds || arr === roleIds) {
    arr.sort((a, b) => a - b);
  }
}

function getDatabaseInfo(table, column) {
  let choiceArr;

  switch (table) {
    case `department`:
      choiceArr = deptList;
      break;
    case `role`:
      choiceArr = roleList;
      break;
    case `employee`:
      choiceArr = staffList;
      break;
    default:
      throw new Error(`Unknown table, unexpected case.`);
  }

  if (table === `employee` && column === `Full Name`) {
    connection.query(queries.stfFN, (err, res) => {
      if (err) {
        throw err;
      }
      fillArr(choiceArr, table, column, res);
    });
  } else {
    connection.query(`SELECT ${column} FROM ${table}`, (err, res) => {
      if (err) {
        throw err;
      }

      switch (column) {
        case `name`:
          fillArr(choiceArr, table, column, res);
          break;
        case `title`:
          fillArr(choiceArr, table, column, res);
          break;
        case `id`:
          if (table === `employee`) {
            fillArr(staffIds, `ids`, column, res);
          } else if (table === `department`) {
            fillArr(departmentIds, `ids`, column, res);
          } else if (table === `role`) {
            fillArr(roleIds, `ids`, column, res);
          }
          break;
        default:
          throw new Error(`Unknown column, unexpected case.`);
      }
    });
  }
}

function updateInfo(cb) {
  cb(`role`, `title`);
  cb(`department`, `name`);
  cb(`employee`, `Full Name`);
  cb(`employee`, `id`);
  cb(`department`, `id`);
  cb(`role`, `id`);
}

const prompts = {
  main: {
    name: `action`,
    type: `list`,
    message: `What are we doing today?`,
    choices: [`VIEW DB`, `ADD to DB`, `UPDATE DB`, `DELETE from DB`, `Exit`],
  },
  view: {
    name: `View`,
    type: `list`,
    choices: [
      `List All`,
      `Employees`,
      `Departments`,
      `Roles`,
      `Staff by Department`,
      `Staff by Manager`,
      `Budgets By Dept`,
      `Back`,
    ],
  },
  viewDeptStaff: {
    name: `staffDept`,
    type: `list`,
    message: `Which dept's staff would you like to view?`,
    choices: deptList,
  },
  viewMgrStaff: {
    name: `staffMgr`,
    type: `list`,
    message: `Whose staff would you like to view?`,
    choices: staffList,
  },
  viewBudget: {
    name: `deptBudget`,
    type: `list`,
    message: `Which dept's budget would you like to view?`,
    choices: deptList,
  },
  add: {
    name: `Add`,
    type: `list`,
    choices: [`Employee`, `Department`, `Role`, `Back`],
  },
  update: {
    name: `Update`,
    type: `list`,
    choices: [`Employee Role`, `Employee Manager`, `Back`],
  },
  remove: {
    name: `Remove`,
    type: `list`,
    choices: [`Employee`, `Department`, `Role`, `Back`],
  },
  addStaff: [
    {
      name: `firstName`,
      type: `input`,
      message: `What is the employee's first name?`,
      validate: (name) => {
        const check = name.match(/^[A-Z][a-z]*$/);
        if (check) {
          return true;
        } else {
          return `Please enter a valid first name`;
        }
      },
    },
    {
      name: `lastName`,
      type: `input`,
      message: `What is the employee's last name?`,
      validate: (name) => {
        const check = name.match(/^[A-Z][a-z]*$/);
        if (check) {
          return true;
        } else {
          return `Please enter a valid last name`;
        }
      },
    },
    {
      name: `role`,
      type: `list`,
      message: `What is the employee's role?`,
      choices: roleList,
    },
    {
      name: `manager`,
      type: `list`,
      message: `Who is the employee's manager?`,
      choices: staffList,
    },
  ],
  addDept: [
    {
      name: `departmentName`,
      type: `input`,
      message: `What's the new Dept?`,
      validate: (department) => {
        const check = department.match(
          /^[a-zA-Z]+(([ -][a-zA-Z ])?[a-zA-Z]*)*$/
        );
        if (check) {
          return true;
        } else {
          return `Please enter a valid name for the department`;
        }
      },
    },
  ],
  addRole: [
    {
      name: `roleName`,
      type: `input`,
      message: `What's the new position?`,
      validate: (role) => {
        const check = role.match(/^[a-zA-Z]+(([ -][a-zA-Z ])?[a-zA-Z]*)*$/);
        if (check) {
          return true;
        } else {
          return `Please enter a valid name for the role.`;
        }
      },
    },
    {
      name: `salary`,
      type: `input`,
      message: `What's the starting salary?`,
      validate: (salary) => {
        const check = salary.match(/^[1-9][0-9]*([.][0-9]{2}|)$/);
        if (check) {
          return true;
        } else {
          return `Please enter a valid salary.`;
        }
      },
    },
    {
      name: `roleDepartment`,
      type: `list`,
      message: `What Dept is this role in?`,
      choices: deptList,
    },
  ],
  updateRole: [
    {
      name: `editStaff`,
      type: `list`,
      message: `Which staff's role is updated?`,
      choices: staffList,
    },
    {
      name: `roleUpdate`,
      type: `list`,
      message: `What is the staff's new role?`,
      choices: roleList,
    },
  ],
  updateMgr: [
    {
      name: `editStaff`,
      type: `list`,
      message: `Which staff's hates their manager?`,
      choices: staffList,
    },
    {
      name: `managerUpdate`,
      type: `list`,
      message: `Who is their new manager?`,
      choices: staffList,
    },
  ],
  delStaff: {
    name: `delStaff`,
    type: `list`,
    message: `Who is getting terminated?`,
    choices: staffList,
  },
  delDept: {
    name: `delDept`,
    type: `list`,
    message: `Which department are we losing?`,
    choices: deptList,
  },
  delRole: {
    name: `delRole`,
    type: `list`,
    message: `Which role would you like to remove?`,
    choices: roleList,
  },
};

module.exports = {
  prompts,
  initPrompts,
  staffList,
  roleList,
  deptList,
  staffIds,
  departmentIds,
  roleIds,
};
