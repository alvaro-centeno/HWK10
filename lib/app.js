const connection = require("../config/connection");
const queries = require(`../config/orm`);
const { prompt } = require(`inquirer`);
const cTable = require(`console.table`);

const {
  prompts,
  initPrompts,
  staffList,
  roleList,
  deptList,
  staffIds,
  roleIds,
  departmentIds,
} = require(`./prompt`);

function initApp() {
  initPrompts();

  prompt(prompts.main).then((res) => {
    switch (res.action) {
      case `VIEW DB`:
        prompt(prompts.view).then((res) => {
          switch (res.View) {
            case `List All`:
              view(`all`);
              break;
            case `Employees`:
              view(`employees`);
              break;
            case `Departments`:
              view(`departments`);
              break;
            case `Roles`:
              view(`roles`);
              break;
            case `Staff by Department`:
              view(`staffDept`);
              break;
            case `Staff by Manager`:
              view(`staffMgr`);
              break;
            case `Budgets By Dept`:
              view(`budget`);
              break;
            case `Back`:
              initApp();
              break;
          }
        });
        break;
      case `ADD to DB`:
        prompt(prompts.add).then((res) => {
          switch (res.Add) {
            case `Employee`:
              add(`employee`);
              break;
            case `Department`:
              add(`department`);
              break;
            case `Role`:
              add(`role`);
              break;
            case `Back`:
              initApp();
              break;
          }
        });
        break;
      case `UPDATE DB`:
        prompt(prompts.update).then((res) => {
          switch (res.Update) {
            case `Employee Role`:
              update(`employeeRole`);
              break;
            case `Employee Manager`:
              update(`employeeManager`);
              break;
            case `Back`:
              initApp();
              break;
          }
        });
        break;
      case `DELETE from DB`:
        prompt(prompts.remove).then((res) => {
          switch (res.Remove) {
            case `Employee`:
              remove(`employee`);
              break;
            case `Department`:
              remove(`department`);
              break;
            case `Role`:
              remove(`role`);
              break;
            case `Back`:
              initApp();
              break;
          }
        });
        break;
      case `Back`:
        initApp();
        break;
      default:
        console.log(`Exiting app....`);
        connection.end();
    }
  });
}

function view(choice) {
  switch (choice) {
    case `departments`:
      getQuery(`view`, queries.allDept);
      break;
    case `roles`:
      getQuery(`view`, queries.allRoles);
      break;
    case `employees`:
      getQuery(`view`, queries.stfFN);
      break;
    case `all`:
      getQuery(`view`, queries.allStaff);
      break;
    case `staffDept`:
      prompt(prompts.viewDeptStaff).then((res) => {
        const departmentIdIndex = deptList.indexOf(res.staffDept);
        const departmentId = departmentIds[departmentIdIndex];

        getQuery(`view`, queries.staffDept, departmentId);
      });
      break;
    case `staffMgr`:
      prompt(prompts.viewMgrStaff).then((res) => {
        const managerIdIndex = staffList.indexOf(res.staffMgr);
        const managerId = staffIds[managerIdIndex];

        getQuery(`view`, queries.staffMgr, managerId);
      });
      break;
    case `budget`:
      prompt(prompts.viewBudget).then((res) => {
        getQuery(`view`, queries.budget, res.deptBudget);
      });
      break;
    default:
      throw new Error(`Choice does not exists - error`);
  }
}

function add(choice) {
  switch (choice) {
    case `employee`:
      staffList.push(`NULL`);

      prompt(prompts.addStaff).then((res) => {
        const roleId = roleList.indexOf(res.role) + 1;
        const managerIdIndex = staffList.indexOf(res.manager);
        const managerId = staffIds[managerIdIndex];

        getQuery(`add`, queries.addStaff, {
          fName: res.firstName,
          lName: res.lastName,
          role_id: roleId,
          mgr_id: managerId,
        });

        console.log(
          `Added ${res.firstName} ${res.lastName} to the employee database! `
        );
      });
      break;
    case `department`:
      prompt(prompts.addDept).then((res) => {
        getQuery(`add`, queries.addDept, { name: res.departmentName });

        console.log(`--- Added ${res.departmentName} as a department! ---`);
      });
      break;
    case `role`:
      prompt(prompts.addRole).then((res) => {
        const departmentIdIndex = deptList.indexOf(res.roleDepartment);
        const departmentId = departmentIds[departmentIdIndex];

        getQuery(`add`, queries.addRole, {
          title: res.roleName,
          salary: res.salary,
          dept_id: departmentId,
        });

        console.log(`--- Added ${res.roleName} as a role! ---`);
      });
      break;
    default:
      console.log(`Error!`);
      connection.end();
  }
}

function remove(choice) {
  switch (choice) {
    case `employee`:
      prompt(prompts.delStaff).then((res) => {
        const employeeIdIndex = staffList.indexOf(res.delStaff);
        const employeeId = staffIds[employeeIdIndex];

        getQuery(`remove`, queries.delStaff, { id: employeeId });

        console.log(`--- Removed ${res.delStaff} from the database ---`);
      });
      break;
    case `department`:
      prompt(prompts.delDept).then((res) => {
        getQuery(`remove`, queries.delDept, {
          name: res.delDept,
        });

        console.log(
          `--- Removed ${res.delDept} as a Dept from the database. \nStaff has been terminated as well. ---`
        );
      });
      break;
    case `role`:
      prompt(prompts.delRole).then((res) => {
        getQuery(`remove`, queries.delRole, {
          title: res.delRole,
        });

        console.log(
          `--- Removed ${res.delRole} as a role from the database. \nStaff has been terminated as well.---`
        );
      });
      break;
    default:
      throw new Error(`Unexpected choice resulting in an error.`);
  }
}

function update(choice) {
  switch (choice) {
    case `employeeRole`:
      prompt(prompts.updateRole).then((res) => {
        editStaff(res.editStaff, roleList, res.roleUpdate, roleIds, `role_id`);

        console.log(
          `--- Updated ${res.editStaff}'s role to ${res.roleUpdate} ---`
        );
      });
      break;
    case `employeeManager`:
      staffList.push(`NULL`);

      prompt(prompts.updateMgr).then((res) => {
        editStaff(
          res.editStaff,
          staffList,
          res.managerUpdate,
          staffIds,
          `mgr_id`
        );

        console.log(
          `--- ${res.editStaff} now reports to ${res.managerUpdate} ---`
        );
      });
      break;
    default:
      console.log(`Error!`);
      connection.end();
  }
}

function editStaff(employee, choiceArr, columnUpdate, idArr, columnId) {
  const employeeIdIndex = staffList.indexOf(employee);
  const employeeId = staffIds[employeeIdIndex];
  const columnUpdateIndex = choiceArr.indexOf(columnUpdate);
  const choiceUpdate = idArr[columnUpdateIndex];
  const updateObj = { [columnId]: choiceUpdate };

  getQuery(`update`, queries.editStaff, [updateObj, { id: employeeId }]);
}

function getQuery(choice, type, setting) {
  connection.query(type, setting, (err, res) => {
    if (err) {
      throw err;
    }
    const table = cTable.getTable(res);

    if (choice === `view`) {
      if (res.length === 0) {
        console.log(
          `\nNo data! \nMay not be a manager. \nMay not have employees in this Dept yet.`
        );
      }
      console.log(`\n${table}`);

      initApp();
    } else {
      initApp();
    }
  });
}

module.exports = {
  initApp,
};
