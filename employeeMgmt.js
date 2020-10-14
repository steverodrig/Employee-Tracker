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

    // Show roles as reference
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
    })

    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: "Enter employee's first name\n",
                validate: function (value) {
                    if (value.length == 0) {
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "last",
                type: "input",
                message: "Enter employee's last name",
                validate: function (value) {
                    if (value.length == 0) {
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "role",
                type: "input",
                message: "Enter employee's title id #: Refer to chart above",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {

            var mgmtId = []
            var roleId = parseInt(answer.role);

            // Push appropriate manager id#
            if (roleId == 3 || roleId == 6 || roleId == 7 || roleId == 8) {
                mgmtId.push(2)
            } else if (roleId == 4 || roleId == 5) {
                mgmtId.push(1);
            }

            var query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            connection.query(query, [answer.first, answer.last, roleId, mgmtId[0]], function (err, res) {
                if (err) throw (err);
                console.table(res);
                start();
            })
        })
}
// Update employee's last name or role
function updateEmp() {
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                message: "What do you want to update?",
                choices: ["Title", "Last name", "Exit"]
            },
        ])
        .then(function (answer) {

            switch (answer.action) {
                //Update role
                case "Title":
                    // Show roles as reference
                    var query = "SELECT id, title FROM role";
                    connection.query(query, function (err, res) {
                        if (err) throw (err);
                        console.table(res);
                    })

                    function rolid() {
                        inquirer
                            .prompt([
                                {
                                    name: "name",
                                    type: "input",
                                    message: " Enter the employee's first name\n",
                                    validate: function (value) {
                                        if (value.length == 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                {
                                    name: "role",
                                    type: "input",
                                    message: "Enter employee's new title id #: Refer to chart above",
                                    validate: function (value) {
                                        if (isNaN(value) === false) {
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            ])
                            .then(function (answerR) {
                                var queryR = "UPDATE employees SET role_id = ? WHERE first_name = ?";

                                connection.query(queryR, [answerR.role, answerR.name], function (err, res) {
                                    if (err) throw (err);
                                    console.table(res);
                                    start();
                                });
                            });
                    }
                    rolid();
                    break;

                case "Last name":

                    function lastName() {
                        inquirer
                            .prompt([
                                {
                                    name: "fname",
                                    type: "input",
                                    message: "Enter the employee's first name",
                                    validate: function (value) {
                                        if (value.length == 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                {
                                    name: "lname",
                                    type: "input",
                                    message: "Enter the employee's new last name",
                                    validate: function (value) {
                                        if (value.length == 0) {
                                            return false;
                                        }
                                        return true;
                                    }
                                }
                            ])
                            .then(function (answerL) {
                                var queryL = "UPDATE employees SET last_name = ? WHERE first_name = ?";

                                connection.query(queryL, [answerL.lname, answerL.fname], function (err, res) {
                                    if (err) throw (err);
                                    console.table(res);
                                    start();
                                });
                            });
                    }
                    lastName();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })

}

// Delete employee function
function delEmp() {

    inquirer
        .prompt([
            {
                name: "fname",
                type: "input",
                message: "Enter the first name of employee you wish to delete",
                validate: function (value) {
                    if (value.length == 0) {
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "lname",
                type: "input",
                message: "Enter the last name of employee you wish to delete",
                validate: function (value) {
                    if (value.length == 0) {
                        return false;
                    }
                    return true;
                }
            }
        ])
        .then(function (answer) {
            var query = "DELETE FROM employees WHERE (first_name = ? AND last_name = ?)";

            connection.query(query, [answer.fname, answer.lname], function (err, res) {
                if (err) throw (err);
                console.table(res);
                start();
            });
        })
}

// View and edit department function
function editDepts() {

    inquirer
        .prompt([
            {
                name: "frstact",
                type: "list",
                message: "Do you want to add a department?",
                choices: ["Yes", "No", "View all departments\n"]
            }
        ])
        .then(function (ans) {

            switch (ans.frstact) {

                case "Yes":
                    inquirer
                        .prompt([
                            {
                                name: "depname",
                                type: "input",
                                message: "What is the name of the new department?",
                                validate: function (value) {
                                    if (value.length == 0) {
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        ])
                        .then(function (answer) {
                            var queryA = "INSERT INTO department (name) VALUES (?)";
                            connection.query(queryA, [answer.depname], function (err, res) {
                                if (err) throw (err);
                                console.table(res);
                                start();
                            })
                        })
                    break;

                case "No":
                    inquirer
                        .prompt([
                            {
                                name: "action",
                                type: "list",
                                message: "Do you want to delete a department?",
                                choices: ["Yes", "Go back", "Exit"]
                            }
                        ])
                        .then(function (answer) {

                            switch (answer.action) {

                                case "Yes":
                                    inquirer
                                        .prompt([
                                            {
                                                name: "dept",
                                                type: "list",
                                                message: "Which department do you wish to delete?",
                                                choices: ["Pathology", "Histology", "Office", "Maintenance", "Whiners"]
                                            },
                                        ])
                                        .then(function (answer) {
                                            var queryD = "DELETE FROM department WHERE name = ?";
                                            connection.query(queryD, [answer.dept], function (err, res) {
                                                if (err) throw (err);
                                                console.table(res);
                                                start();
                                            })
                                        })
                                    break;

                                case "Go back":
                                    start();
                                    break;

                                case "Exit":
                                    connection.end();
                                    break;
                            }
                        })
                    break;

                case "View all departments\n":
                    var query = "SELECT * FROM department";
                    connection.query(query, function (err, res) {
                        if (err) throw (err);
                        console.table(res);
                    });
                    editDepts();
                    break;
            }
        })
}

// View and edit role function
function editRoles() {

    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                message: "Do you want to add a role?",
                choices: ["Yes", "No", "View all roles\n"]
            }
        ])
        .then(function (ans) {

            switch (ans.action) {

                case "Yes":
                    inquirer
                        .prompt([
                            {
                                name: "rolname",
                                type: "input",
                                message: "What is the name of the new role?",
                                validate: function (value) {
                                    if (value.length == 0) {
                                        return false;
                                    }
                                    return true;
                                }
                            },
                            {
                                name: "salary",
                                type: "input",
                                message: "What is the salary?",
                                validate: function (value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    }
                                    return false;
                                }
                            },
                            {
                                name: "dept",
                                type: "list",
                                message: "What department is the new role in?",
                                choices: ["Pathology", "Histology", "Office", "Maintenance"]   
                            }
                        ])
                        .then(function (answer) {
                            var mgmId = [];
                            var salary = parseInt(answer.salary);
                            var dept = answer.dept
                            if(dept === "Pathology") {
                                mgmId.push(1);
                            } else if(dept === "Histology") {
                                mgmId.push(2);
                            } else if(dept === "Office") {
                                mgmId.push(3);
                            } else if(dept === "Maintenance") {
                                mgmId.push(4);
                            }

                            var queryA = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                            connection.query(queryA, [answer.rolname, salary, mgmId[0]], function (err, res) {
                                if (err) throw (err);
                                console.table(res);
                                start();
                            })
                        })
                    break;

                case "No":
                    inquirer
                        .prompt([
                            {
                                name: "action",
                                type: "list",
                                message: "Do you want to delete a role?",
                                choices: ["Yes", "Go back", "Exit"]
                            }
                        ])
                        .then(function (answer) {

                            switch (answer.action) {

                                case "Yes":
                                    inquirer
                                        .prompt([
                                            {
                                                name: "role",
                                                type: "list",
                                                message: "Which role do you wish to delete?",
                                                choices: ["Histology Manager", "Office Manager", "pathologist", "Histotech", "Grosser", "Transcriptionist", "Office Clerk", "Janitor", "Whiner"]
                                            },
                                        ])
                                        .then(function (answer) {
                                            var queryRole = "DELETE FROM role WHERE title = ?";
                                            connection.query(queryRole, [answer.role], function (err, res) {
                                                if (err) throw (err);
                                                console.table(res);
                                                start();
                                            })
                                        })
                                    break;

                                case "Go back":
                                    start();
                                    break;

                                case "Exit":
                                    connection.end();
                                    break;
                            }
                        })
                    break;

                case "View all roles\n":
                    var query = "SELECT * FROM role";
                    connection.query(query, function (err, res) {
                        if (err) throw (err);
                        console.table(res);
                    });
                    editRoles();
                    break;
            }
        })
}

