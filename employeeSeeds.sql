
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

