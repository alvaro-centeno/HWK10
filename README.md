# HWK 10 (12) MySQL: Employee Tracker

## Description

This is a web application known as **CMS** that can be used maintain a company's employees' database written with express, inquirer, and use of MySQL to enable easy upkeeping. It is deployed on [Heroku](https://ic-mysql_emptracker.herokuapp.com/).

````
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```HAT I can organize my thoughts and keep track of tasks I need to complete
````

#### Author(s)

![user's avatar](https://avatars.githubusercontent.com/u/58826890?v=4&s=100)
user: [ichoi21](https://github.com/ichoi21) | email: ic@g.co | repos: [Click Here](https://github.com/ichoi21?tab=repositories)

---

### Contents

![Database Schema](Assets/schema.png)

- **department**:

  - **id** - INT PRIMARY KEY
  - **name** - VARCHAR(30) to hold department name

- **role**:

  - **id** - INT PRIMARY KEY
  - **title** - VARCHAR(30) to hold role title
  - **salary** - DECIMAL to hold role salary
  - **department_id** - INT to hold reference to department role belongs to

- **employee**:

  - **id** - INT PRIMARY KEY
  - **first_name** - VARCHAR(30) to hold employee first name
  - **last_name** - VARCHAR(30) to hold employee last name
  - **role_id** - INT to hold reference to role employee has
  - **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager

Build a command-line application that at a minimum allows the user to:

- Add departments, roles, employees
- View departments, roles, employees
- Update employee roles

Bonus points if you're able to:

- Update employee managers
- View employees by manager
- Delete departments, roles, and employees
- View the total utilized budget of a department -- ie the combined salaries of all employees in that department

#### Languages Used

- JavaScript
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/) "^4.17.1"
- MySQL

### Minimum Requirements

- Functional application.
- GitHub repository with a unique name and a README describing the project.
- The command-line application should allow users to:
- Add departments, roles, employees
- View departments, roles, employees
- Update employee roles

### How to install

Perform the following:

```bash
npm i -y
npm i express
npm i inquirer
npm i mysql
```

### Intended Usage

Demonstration knowledge of MySQL added to the use of Javascript, express, and node by creating a DB with MySQL prompting user to be able to:

- Add departments, roles, employees
- View departments, roles, employees
- Update employee roles
