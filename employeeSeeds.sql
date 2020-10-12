DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT AUTO-INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
)

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,4) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
        REFERENCES department(id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id)
        REFERENCES role(id)
);

INSERT INTO department (name)
VALUES ("Pathology"), ("Histology"), ("Office"), ("Maintenance");

INSERT INTO role (title, salary, department_id)
VALUES ("Histology Manager", 85000, 1), ("Office Manager", 105000, 2), ("pathologist", 279000, 0), ("Histotech", 56000, 1), ("Grosser", 64000, 1), 
("Transcriptionist", 42000, 2), ("Office Clerk", 40000, 2), ("Janitor", 24000, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Schmeaux", 1, 1), ("Sarah", "Plainentall", 2, 2), ("Bo", "Jangles", 3, 3), ("Everett", "Montain", 4, 4);

SELECT * FROM department;
SELECT * FROM  role;
SELECT * FROM employees;

