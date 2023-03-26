USE employee_db;
-- Seed departments data
INSERT INTO departments (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Human Resources');

-- Seed roles data
INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Manager', 90000, 1),
       ('Software Engineer', 80000, 2),
       ('Accountant', 70000, 3),
       ('HR Specialist', 60000, 4);

-- Seed employees data
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Michael', 'Johnson', 3, 1),
       ('Emily', 'Davis', 4, 1);
