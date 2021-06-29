const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const util = require('util');

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

const connectionPromise = connection;

connectionPromise.query = util.promisify(connectionPromise.query);

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
            'Add Departments',
            'View employees by manager',
            'Quit'
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
            //Runs function to view all employees by department'
            viewEmployeesByDepartment();
        } else if (answer.action === 'View employees by manager') {
            //Runs function to update employee
            viewEmployeeByManager();
        } else if (answer.action === 'Add Employee') {
            //Runs function to add employee
            addEmployee();
        } else if (answer.action === 'Add Role') {
            //Runs function to add role
            addRole();
        } else if (answer.action === 'Add Departments') {
            //Runs function to add departments
            addDepartment();
        } else if ( answer.action === 'Update Employee'){
            updateEmployee();
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
        runEmployee();
    })
}

//Create function to view all employees by roles
const viewEmployeesByRole = async () => {
    const roleArray = await selectRole();
    inquirer.prompt({
        name: 'role',
        type: 'list',
        message: 'What role do you want to choose from?',
        choices: roleArray
    }).then((answer) => {
        const query = 'SELECT first_name, last_name, salary, name FROM employee JOIN role ON role.id = role_id JOIN department ON department.id = department_id WHERE ?';
        connection.query(query, { title: answer.role }, (err, res) => {
            if (err) throw err;
            console.table(res);
            runEmployee();
        })
    })
}


//Create function to view all employees by departments
const viewEmployeesByDepartment = async () => {
    const roleArray = await selectDeparment();
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'What department do you want to choose from?',
        choices: roleArray
    }).then((answer) => {
        const query = 'SELECT first_name, last_name, salary, title FROM employee JOIN role ON role.id = role_id JOIN department ON department.id = department_id WHERE ?';
        connection.query(query, { name: answer.department }, (err, res) => {
            if (err) throw err;
            console.table(res);
            runEmployee();
        })
    })
}


//Create function to view employees by manager
const viewEmployeeByManager = async () => {
    const managerData = await selectManager();
    const managerList = managerData.managerReturn.map(({first_name, last_name, id}) => ({
        name: first_name,
        value: id
    }))
    const managerQuestion = await inquirer.prompt([
        {
            name: 'name',
            type: 'list',
            message: 'Which manager would you like to select?',
            choices: managerList
        }
    ])
    const query = `SELECT first_name, last_name FROM employee WHERE manager_id = '${managerQuestion.name}' `
    connection.query(query, {}, (err,res) => {
        console.table(res);
        runEmployee();
    })
}


//Get role data
async function selectRole(){
    const roleArr = [];
    const roleReturn = await connectionPromise.query('SELECT * FROM role');
    for(let i = 0; i < roleReturn.length; i++){
        roleArr.push(roleReturn[i].title)
    }
    return roleArr;
}

//Get manager data
async function selectManager(){
    const tempObj = {managerArr: []}
    //const managerArr = [];
    const managerReturn = await connectionPromise.query('SELECT first_name, last_name, id FROM employee WHERE manager_id is NULL');
    tempObj.managerReturn = managerReturn;
    for(let i = 0; i < tempObj.managerReturn.length; i++){
        tempObj.managerArr.push(tempObj.managerReturn[i].first_name);
    }
    return tempObj;
}

//Get Department data
async function selectDeparment(){
    const departmentArr = [];
    const roleReturn = await connectionPromise.query('SELECT name FROM department');
        for(let i = 0; i < roleReturn.length; i++){
            departmentArr.push(roleReturn[i].name);
        }
    return departmentArr;
}

//Get name data
async function selectName(){
    const nameArr = [];
    const roleReturn = await connectionPromise.query('SELECT first_name FROM employee');
        for(let i = 0; i < roleReturn.length; i++){
            nameArr.push(roleReturn[i].first_name);
        }
    return nameArr;
}

//Create function to add employee
const addEmployee = async() => {
    const managerData = await selectManager();
    const managerList = managerData.managerArr;
    const roleList = await selectRole();
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
            choices: roleList
        },
        {
            name: 'choice',
            type: 'rawlist',
            message: 'Whats your managers name?',
            choices: managerList
        }
        ]).then((answer) => {
            const roleNum = roleList.indexOf(answer.role) + 1;
            const managerNum = managerList.indexOf(answer.choice) + 1;
            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', ${roleNum}, ${managerNum})`;
            connection.query(query, (err,res) => {
                if(err) throw err;
                console.log('Added the employee!');
                runEmployee();
            })
        })
}

//Create function to add role
const addRole = async () => {
    const roleArray = await selectDeparment();
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
            choices: roleArray
        }
        ]).then((answer) => {
            const departmentNum = roleArray.indexOf(answer.department) + 1;
            const query = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${departmentNum}')`;
            connection.query(query, (err,res) => {
                if(err) throw err;
                console.log('Added the new role!');
                runEmployee();
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
                runEmployee();
            })
        })
}

//Create function to update employee
const updateEmployee = async () => {
    const managerData = await selectName();
    const roleList = await selectRole();
    inquirer.prompt([
        {
            name: 'name',
            type: 'list',
            message: 'What employee would you like to update?',
            choices: managerData
        },
        {
            name: 'role',
            type: 'list',
            message: 'What employees role would you like to update?',
            choices: roleList
        }
        ]).then((answer) => {
            const roleNum = roleList.indexOf(answer.role) + 1;
            const query = `UPDATE employee SET role_id = '${roleNum}' WHERE first_name = '${answer.name}'`;
            connection.query(query, (err,res) => {
                if(err) throw err;
                console.log('Updated the employees role');
                runEmployee();
            })
        })
}