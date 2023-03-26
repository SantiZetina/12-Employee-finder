const inquirer = require('inquirer')
const connection = require('./connection')

function start() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit',
          ],
        },
      ])
      .then((answer) => {
        switch (answer.action) {
          case 'View all departments':
            viewDepartments();
            break;
          case 'View all roles':
            viewRoles();
            break;
          case 'View all employees':
            viewEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            connection.end();
            break;
        }
      });
  }
  
  function viewDepartments(){
    connection.query('SELECT * FROM departments', (err, res) => {
        if(err) throw err;
        console.table(res)
        start()
    })
  }

  function viewRoles(){
    connection.query('SELECT * FROM roles', (err, res) => {
        if(err) throw err;
        console.table(res);
        start()
    })
  }

  function viewEmployees(){
    connection.query('SELECT * FROM employees', (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    })
  }

  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'What is the name of the department?',
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO departments SET ?',
          {
            name: answer.departmentName,
          },
          (err) => {
            if (err) throw err;
            console.log('Department added successfully!');
            start();
          }
        );
      });
  }
  

  function addRole() {
    connection.query('SELECT * FROM departments', (err, departments) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the role?',
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?',
          },
          {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does this role belong to?',
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            'INSERT INTO roles SET ?',
            {
              title: answer.roleTitle,
              salary: answer.roleSalary,
              department_id: answer.departmentId,
            },
            (err) => {
              if (err) throw err;
              console.log('Role added successfully!');
              start();
            }
          );
        });
    });
  }
  
  function addEmployee() {
    connection.query('SELECT * FROM roles', (err, roles) => {
      if (err) throw err;
  
      connection.query('SELECT * FROM employees', (err, employees) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'firstName',
              message: "What is the employee's first name?",
            },
            {
              type: 'input',
              name: 'lastName',
              message: "What is the employee's last name?",
            },
            {
              type: 'list',
              name: 'roleId',
              message: "What is the employee's role?",
              choices: roles.map((role) => ({
                name: role.title,
                value: role.id,
              })),
            },
            {
              type: 'list',
              name: 'managerId',
              message: "Who is the employee's manager?",
              choices: [
                { name: 'None', value: null },
                ...employees.map((employee) => ({
                  name: `${employee.first_name} ${employee.last_name}`,
                  value: employee.id,
                })),
              ],
            },
          ])
          .then((answer) => {
            connection.query(
              'INSERT INTO employees SET ?',
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.roleId,
                manager_id: answer.managerId,
              },
              (err) => {
                if (err) throw err;
                console.log('Employee added successfully!');
                start();
              }
            );
          });
      });
    });
  }
  

  function updateEmployeeRole() {
    connection.query('SELECT * FROM employees', (err, employees) => {
      if (err) throw err;
  
      connection.query('SELECT * FROM roles', (err, roles) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Which employee do you want to update?',
              choices: employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            },
            {
              type: 'list',
              name: 'newRoleId',
              message: 'What is the new role for this employee?',
              choices: roles.map((role) => ({
                name: role.title,
                value: role.id,
              })),
            },
          ])
          .then((answer) => {
            connection.query(
              'UPDATE employees SET ? WHERE ?',
              [
                { role_id: answer.newRoleId },
                { id: answer.employeeId },
              ],
              (err) => {
                if (err) throw err;
                console.log('Employee role updated successfully!');
                start();
              }
            );
          });
      });
    });
  }
  

  start();