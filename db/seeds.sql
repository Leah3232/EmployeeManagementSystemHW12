USE tracker_db;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Sales Person", 80000, 1),
       ("Lead Engineer", 120000, 2),
       ("Software Engineer", 100000, 2),
       ("Account Manager", 90000, 3),
       ("Accountant", 70000, 3 ),
       ("Legal Team Lead", 80000, 4),
       ("Lawyer", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Vincent", "Van Gogh", 1, NULL),
       ("Britney", "Spears", 2, 1),
       ("Dwayne", "Johnson", 3, NULL),
       ("Ernest", "Hemingway", 4, 3),
       ("Bill", "Murray", 5, NULL),
       ("Elvis", "Presley", 6, 5),
       ("Queen", "Elizabeth", 7, NULL),
       ("Tiger", "Woods", 8, 7);