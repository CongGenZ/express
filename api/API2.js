const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
//const dataFilePath = path.join(__dirname, 'employees.json');

const dataFilePath = './data/employees.json';

app.use(express.json());

const readEmployees = () => {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeEmployees = (employees) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(employees, null, 2));
};

app.get('/employees', (req, res) => {
    const employees = readEmployees();
    res.json(employees);
});

// Add a new employee
app.post('/employees', (req, res) => {
    const employees = readEmployees();
    const newEmployee = {
        id: Date.now().toString(),
        name: req.body.name,
        age: req.body.age,
        departmentId: req.body.departmentId,
        phone: req.body.phone,
        email: req.body.email,
        salary: req.body.salary
    };
    employees.push(newEmployee);
    writeEmployees(employees);
    res.status(201).json(newEmployee);
});

// Update an employee
app.put('/employees/:id', (req, res) => {
    const employees = readEmployees();
    const employeeIndex = employees.findIndex(emp => emp.id === req.params.id);
    if (employeeIndex !== -1) {
        employees[employeeIndex] = {
            ...employees[employeeIndex],
            ...req.body
        };
        writeEmployees(employees);
        res.json(employees[employeeIndex]);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
    let employees = readEmployees();
    const employeeIndex = employees.findIndex(emp => emp.id === req.params.id);
    if (employeeIndex !== -1) {
        employees = employees.filter(emp => emp.id !== req.params.id);
        writeEmployees(employees);
        res.json({ message: 'Employee deleted' });
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




// {
  //   "id": 1,
  //   "Name": "Phong thiet ke",
  //   "Description": "chuyen thiet ke ban ve cho dev",
  //   "DirectorId": "nguyen van cong"
  // },
  // {
  //   "id": 2,
  //   "Name": "Phong mkt",
  //   "Description": "chuyen vien tu van khach hang",
  //   "DirectorId": "nguyen van cong"
  // },
  // {
  //   "id": 3,
  //   "Name": "Phong BA",
  //   "Description": "tim khach hang"
  // }


  //[
    //   {
    //     "id": "1722527775489",
    //     "name": "John Doe",
    //     "age": 30,
    //     "phone": "123-456-7890",
    //     "email": "john.doe@example.com",
    //     "salary": 50000
    //   }
    // ]