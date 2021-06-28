const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Password1',
    database: 'employeedb'
})

connection.connect((err) => {
    if (err) throw err;
    runEmployee();
});


function runEmployee() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Employees By Roles',
            'View All Employees By Departments',
            'Update Employee',
            'Add Employee',
            'Add Role',
            'Add Departments'
        ]
    }).then((answer) => {
        if (answer.action === 'View All Employees') {
            console.log('Viewing all employees');
            //Runs function to view all employees
            viewEmployees();
        } else if (answer.action === 'View All Employees By Roles') {
            //Runs function to view all employees by roles
            viewEmployeesByRole();
        } else if (answer.action === 'View All Employees By Departments') {
            //Runs function to view all employees by department
            viewEmployeesByDepartment();
        } else if (answer.action === 'Update Employee') {
            //Runs function to update employee
        } else if (answer.action === 'Add Employee') {
            //Runs function to add employee
            addEmployee();
        } else if (answer.action === 'Add Role') {
            //Runs function to add role
            addRole();
        } else if (answer.action === 'Add Departments') {
            //Runs function to add departments
            addDepartment();
        } else {
            console.log('Goodbye!');
        }
    })
}

//Create function to view all employees
const viewEmployees = () => {
    const query = 'SELECT first_name, last_name, title, salary, name FROM employee JOIN role ON role.id = role_id JOIN department ON department.id = department_id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })
}

//Create function to view all employees by roles
const viewEmployeesByRole = () => {
    inquirer.prompt({
        name: 'role',
        type: 'list',
        message: 'What role do you want to choose from?',
        choices: [
            'Sales Lead',
            'Salesperson',
            'Lead Engineer',
            'Software Engineer',
            'Accountant',
            'Legal Team Lead',
            'Lawyer',
            'Account Manager'
        ]
    }).then((answer) => {
        const query = 'SELECT first_name, last_name, salary, name FROM employee JOIN role ON role.id = role_id JOIN department ON department.id = department_id WHERE ?';
        connection.query(query, { title: answer.role }, (err, res) => {
            if (err) throw err;
            console.table(res);
        })
    })
}


//Create function to view all employees by departments
const viewEmployeesByDepartment = () => {
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'What department do you want to choose from?',
        choices: [
            'Sales',
            'Engineering',
            'Finance',
            'legal'
        ]
    }).then((answer) => {
        const query = 'SELECT first_name, last_name, salary, title FROM employee JOIN role ON role.id = role_id JOIN department ON department.id = department_id WHERE ?';
        connection.query(query, { name: answer.department }, (err, res) => {
            if (err) throw err;
            console.table(res);
        })
    })
}

//Get role data
const roleArr = [];
function selectRole(){
    connection.query('SELECT * FROM role', (err, res) => {
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            roleArr.push(res[i].title)
        }
    })
    return roleArr;
}

//Get manager data
const managerArr = [];
function selectManager(){
    connection.query('SELECT first_name, last_name FROM employee WHERE manager_id is NULL', (err,res) => {
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            managerArr.push(res[i].first_name);
        }
    })
    return managerArr;
}

//Get Department data
const departmentArr = [];
function selectDeparment(){
    connection.query('SELECT name FROM department', (err,res) => {
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            departmentArr.push(res[i].name);
        }
    })
    return departmentArr;
}

//Create function to add employee
const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is your first name'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is your last name'
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is your role?',
            choices: selectRole()
        },
        {
            name: 'choice',
            type: 'rawlist',
            message: 'Whats your managers name?',
            choices: selectManager()
        }
        ]).then((answer) => {
            const roleNum = roleArr.indexOf(answer.role) + 1;
            const managerNum = managerArr.indexOf(answer.choice) + 1;
            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', ${roleNum}, ${managerNum})`;
            connection.query(query, (err,res) => {
                if(err) throw err;
                console.log('Added the employee!');
            })
        })
}

//Create function to add role
const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is your title?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for the role?'
        },
        {
            name: 'department',
            type: 'list',
            message: 'What department is it under?',
            choices: selectDeparment()
        }
        ]).then((answer) => {
            const departmentNum = departmentArr.indexOf(answer.department) + 1;
            const query = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${departmentNum})`;
            connection.query(query, (err,res) => {
                if(err) throw err;
                console.log('Added the new role!');
            })
        })
}

//Create function to add department
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the department called?'
        }
        ]).then((answer) => {
            const query = `INSERT INTO department (name) VALUES ('${answer.name}')`;
            connection.query(query, (err,res) => {
                if(err) throw err;
                console.log('Added the new department!');
            })
        })
}

//Create function to update employee







/*=============================

const roleList = [];
    new Promise((resolve, reject) => {
        const query = 'SELECT title FROM role';
        connection.query(query, (err, res) => {
            for (let i = 0; i < res.length; i++) {
                roleList.push(res[i].title);
            }
        resolve(roleList);
        })
    })
        .then((roleList) => {
            inquirer.prompt({
                name: 'role',
                type: 'rawlist',
                message: 'What role do you want to choose from?',
                choices: roleList
            })
        })
    //const query = 'SELECT employees FROM employeedb WHERE ?'
    //connection.query(query, {title: })
    .then((answer) => {
        const getRole = 'SELECT employees FROM employeedb WHERE ?'
        connection.query(getRole, {title: answer.role}, (err, res) => {
            if(err) throw err;
            console.table(res);
        })
    })

==============================*/


/*
const roles = async () => {
    try {

        const roleQuery = await connection.query('SELECT title FROM role');
        for (let i of roleQuery) {
            await roleList.push(i);
        }
        console.log(roleList);
        /*const query = 'SELECT title FROM role';
        connection.query(query, (err, res) => {
            for (let i = 0; i < res.length; i++) {
                roleList.push(res[i].title);
            }
            console.log(roleList);
        })
    } catch (err) {
        console.log(err);
    }
}
*/