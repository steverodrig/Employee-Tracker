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
        REFERENCES role(id),
    FOREIGN KEY (manager_id)
		REFERENCES role(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO department (name)
VALUES ("Pathology"), ("Histology"), ("Office"), ("Maintenance");

INSERT INTO role (title, salary, department_id)
VALUES ("Histology Manager", 85000, 2), ("Office Manager", 105000, 3), ("pathologist", 279000, 1), ("Histotech", 56000, 2), ("Grosser", 64000, 2), 
("Transcriptionist", 42000, 3), ("Office Clerk", 40000, 3), ("Janitor", 24000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Schmeaux", 1, 1), ("Charles", "Stevens", 3, 2), ("Maren", "Chan", 3, 2), ("Heather", "Miller", 3, 2), ("Janie", "Lewis", 2, 2), ("Bo", "Jangles", 4, 1), 
("Everett", "Montain", 5, 1), ("Tom", "Moffett", 5, 1), ("Nadine", "Peretta", 4, 1), ("Alicia", "Deleon", 6, 2), ("Diana", "Moffett", 7, 2), ("Rose", "Mcgowan", 7, 2), ("Steve", "Rodriguez", 8, 2);

SELECT * FROM department;
SELECT * FROM  role;
SELECT * FROM employees;

