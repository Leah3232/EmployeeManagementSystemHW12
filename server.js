const inquirer = require("inquirer");
const table = require("console.table");
const connection = require("./db/connection")

//Establish connection to database
// const db = mysql.createConnection(
//   {
//     host: "localhost",
//     // MySQL username
//     user: "root",
//     //MySQL password
//     password: "",
//     //Database being connected to
//     database: "tracker_db",
//   },
//   console.log(`Connected to the employee tracker database.`)
// );

// db.connect(function (err) {
//   if (err) throw err;
// });
//Initialize the app
function launchApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userSelect",
        message:
          "Welcome to your employee database! Please select an option below.",
        choices: [
          "View All Employees",
          "Add an Employee",
          "Update Employee Role",
          "View All Departments",
          "View All Roles",
          "Add a Department",
          "Add a Role"
        ],
      },
    ])
    .then((answer) => {
      console.log(answer);
      switch (answer.userSelect) {
        case "View All Employees":
          viewEmployee();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Departments":
          viewDepartment();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Exit":
          console.log("Goodbye!");
          db.end();
          break;
      }
    });
  function viewEmployee() {
    let query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
      if (err) throw err;
      console.log(res.length + " employees are currently employed!");
      console.table("Here are all employees:", res);
      launchApp();
    });
  }
  //Enter new employee information and add to employee table
  function addEmployee() {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's fist name? ",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name? ",
          },
          {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager's ID? ",
          },
          {
            name: "role",
            type: "list",
            choices: function () {
              var roleArray = [];
              for (let i = 0; i < res.length; i++) {
                roleArray.push(res[i].title);
              }
              return roleArray;
            },
            message: "What is this employee's role? ",
          },
        ])
        .then(function (answer) {
          let role_id;
          for (let a = 0; a < res.length; a++) {
            if (res[a].title == answer.role) {
              role_id = res[a].id;
              console.log(role_id);
            }
          }
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              manager_id: answer.manager_id,
              role_id: role_id,
            },
            function (err) {
              if (err) throw err;
              console.table(res);
              console.log("Your employee has been added!");
              launchApp();
            }
          );
        });
    });
  }
  //Add a department to department table
  function addDepartment() {
    inquirer
      .prompt([
        {
          name: "newDept",
          type: "input",
          message: "What is the name of the department?",
        },
      ])
      .then(function (answer) {
        connection.query("INSERT INTO department SET ?", {
          name: answer.newDept,
        });
        let query = "SELECT * FROM department";
        db.query(query, function (err, res) {
          if (err) throw err;
          console.log("Your new department has been added!");
          console.table("All Departments:", res);
          launchApp();
        });
      });
  }
  //Add a new role to role table
  function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "new_role",
            type: "input",
            message: "What new role would you like to add?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of this role? (Enter a number)",
          },
          {
            name: "Department",
            type: "list",
            choices: function () {
              let deptArray = [];
              for (let i = 0; i < res.length; i++) {
                deptArray.push(res[i].name);
              }
              return deptArray;
            },
          },
        ])
        .then(function (answer) {
          let department_id;
          for (let a = 0; a < res.length; a++) {
            if (res[a].name == answer.Department) {
              department_id = res[a].id;
            }
          }

          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.new_role,
              salary: answer.salary,
              department_id: department_id,
            },
            function (err, res) {
              if (err) throw err;
              console.log("Your new role has been added!");
              console.table("All Roles:", res);
              launchApp();
            }
          );
        });
    });
  }
  //View all departments
  function viewDepartment() {
    let query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
      if (err) throw err;
      console.table("All Departments:", res);
      launchApp();
    });
  }
  //View all roles
  function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
      if (err) throw err;
      console.table("All Roles:", res);
      launchApp();
    });
  }
  //Update a current role
  function updateRole() {
    let query = "UPDATE employee SET role_id = ? WHERE id = ?";
    connection.query(
      `SELECT CONCAT(first_name," ",last_name) AS nameOfEmployee, id FROM employee;`,
      function (errEmployee, resEmployee) {
        if (errEmployee) throw errEmployee;
        connection.query("Select title, id FROM role", function (errRole, resRole) {
          if (errRole) throw errRole;
          inquirer
            .prompt([
              {
                name: "nameOfEmployee",
                type: "list",
                message: "Select employee.",
                choices: resEmployee.map((employee) => {
                  return {
                    name: employee.nameOfEmployee,
                    value: employee.id,
                  };
                }),
              },
              {
                name: "employeeRole",
                type: "list",
                message: "Select employee's new role.",
                choices: resRole.map((role) => {
                  return {
                    name: role.title,
                    value: role.id,
                  };
                }),
              },
            ])
            .then(function (answer) {
              connection.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [answer.employeeRole, answer.nameOfEmployee],
                function (err) {
                  if (err) throw err;
                  console.log("Employee role has been updated!");
                  launchApp();
                }
              );
            });
        });
      }
    );
  }
}
launchApp();
