--DEPARTMENTS--

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("legal");

--ROLES--

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 190000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 200000, 3);

--EMPLOYEE

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Ted', 'Mosby', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Hammond', 'Druthers', 4, 1);

INSERT INTO role (first_name, last_name, role_id)
VALUES ('Lily', 'Aldrin', 1);

INSERT INTO role (first_name, last_name, role_id, manager_id)
VALUES ('Brad', 'Morris', 2, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Bilson', 'Dee', 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Marshall', 'Eriksen', 7, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Robin', 'Scherbatsky', 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sandy', 'Rivers', 5, 7);
