var mysql = require("mysql");
var inquirer = require("inquirer");
var ctable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Password1",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw (err);
    console.log("connected as id " + connection.threadId);
    start();
});
// Initial prompt task menu
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View employees", "Edit departments", "Edit roles", "Edit managers", "Exit"]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View employees":
                    viewEmps();
                    break;

                case "Edit departments":
                    editDepts();
                    break;

                case "Edit roles":
                    editRoles();
                    break;

                case "Edit managers":
                    editMgmt();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
};
// Prompt to determine how to view employees
function viewEmps() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all employees", "View employees by department", "View employees by manager", "Go back", "Exit"]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    viewAll();
                    break;

                case "View employees by department":
                    viewDepts();
                    break;

                case "View employees by manager":
                    viewMgmt();
                    break;

                case "Go back":
                    start();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
};
// View all employees
function viewAll() {
    var query = "SELECT * FROM employees";
    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        afterView();
    })
}
// View employees be department
function viewDepts() {
    var query = "SELECT * FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employees ON role.id = employees.role_id"

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        afterView();
    })
}
// View employees by Manager
function viewMgmt() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Select manager?",
            choices: ["Office Manager", "Histology Manager"]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Histology Manager":
                    var query = "SELECT * FROM employees LEFT JOIN role ON role.id = employees.role_id  WHERE manager_id=1 ORDER BY role.id";
                    connection.query(query, function (err, res) {
                        if (err) throw (err);
                        console.table(res);
                    })
                    afterView();
                    break;

                case "Office Manager":
                    var query = "SELECT * FROM employees LEFT JOIN role ON role.id = employees.role_id  WHERE manager_id=2 ORDER BY role.id";
                    connection.query(query, function (err, res) {
                        if (err) throw (err);
                        console.table(res);
                    })
                    afterView();
                    break;

                case "Go back":
                    start();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}
    // Post employee view menu
    function afterView() {
        inquirer
            .prompt({
                name: "action",
                type: "list",
                message: "What would you like to do?",
                choices: ["Add an employee", "Update an employee", "Delete an employee", "Go back", "Exit"]
            })
            .then(function (answer) {
                switch (answer.action) {
                    case "Add an employee":
                        addEmp();
                        break;

                    case "Update an employee":
                        updateEmp();
                        break;

                    case "Delete an employee":
                        delEmp();
                        break;

                    case "Go back":
                        start();
                        break;

                    case "Exit":
                        connection.end();
                        break;
                }
            });
    }
    // Add a new employee
    function addEmp() {
        inquirer
            .prompt([
                {
                    name: "first",
                    type: "input",
                    message: "Enter employee's first name"
                },
                {
                    name: "last",
                    type: "input",
                    message: "Enter employee's last name" 
                },
                {
                    name: "role",
                    type: "input",
                    message: "Enter employee's role id #:\nPathologist = 3\nHistotech = 4\nGrosser = 5\nTranscriptionist = 6\nOffice Clerk = 7\nJanitor = 8\n",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                    }
            ])
            .then (function (answer) {
               
                var mgmtId = []
                var roleId = parseInt(answer.role);
                
                // Push appropriate manager id#
                if(roleId ==  3 ||roleId == 6 ||roleId == 7 ||roleId == 8) {
                    mgmtId.push(2)
                }   else if(roleId == 4 ||roleId == 5) {
                    mgmtId.push(1);
                }

                console.log(mgmtId);
                
                var query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                connection.query(query, [answer.first, answer.last, roleId, mgmtId[0]], function (err, res) {
                    if (err) throw (err);
                    console.table(res);
                    start();
                })
            })
    }

