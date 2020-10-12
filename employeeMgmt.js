var mysql = require("mysql");
var inquirer = require("inquirer");
var ctable = require("console.table");
const { start } = require("repl");


var connection = mysql.connection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Password1",
    database: "employee_db"
});

connection.connect(function(err) {
    if(err) throw(err);
    console.log("connected as id " + connection.threadId);
    start();
});