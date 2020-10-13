var mysql = require("mysql");
var inquirer = require("inquirer");
var ctable = require("console.table");
//const { start } = require("repl");
//const { exit } = require("process");


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

function viewAll() {
    var query = "SELECT * FROM employees";
    connection.query(query, function(err, res) {
        if(err) throw(err);
        console.table(res);
    })
}

function viewDepts() {
    var query = "SELECT * FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employees ON role.id = employees.role_id"

    connection.query(query, function(err, res) {
        if(err) throw(err);
        console.table(res);
    })
}

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
                    connection.query(query, function(err, res) {
                        if(err) throw(err);
                        console.table(res);
                    })
                    connection.end();
                    break;

                case "Office Manager":
                    var query = "SELECT * FROM employees LEFT JOIN role ON role.id = employees.role_id  WHERE manager_id=2 ORDER BY role.id";
                    connection.query(query, function(err, res) {
                        if(err) throw(err);
                        console.table(res);
                    })
                    connection.end();
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