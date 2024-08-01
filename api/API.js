const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to handle JSON data
app.use(express.json());

// File path for data
const dataFilePath = './data/departments.json';

// Read data from file
const readData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Write data to file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Get list of departments
app.get('/departments', (req, res) => {
    const departments = readData();
    
    res.json(departments);
});

// Get a department by ID
app.get('/departments/:id', (req, res) => {
    const departments = readData();
    const department = departments.find(d => d.id === parseInt(req.params.id));
    if (department) {
        res.json(department);
    } else {
        res.status(404).send('Department not found');
    }
});

// Add a new department
app.post('/departments', (req, res) => {
    const departments = readData();
    const newDepartment = {
        id: departments.length + 1,
        ...req.body
    };
    const updatedDepartments = [...departments, newDepartment];
    writeData(updatedDepartments);
    res.status(201).json(newDepartment);
});

// Update department information
app.put('/departments/:id', (req, res) => {
    const departments = readData();
    const departmentIndex = departments.findIndex(d => d.id === parseInt(req.params.id));
    if (departmentIndex !== -1) {
        const updatedDepartment = {
            ...departments[departmentIndex],
            ...req.body
        };
        departments[departmentIndex] = updatedDepartment;
        writeData(departments);
        res.json(updatedDepartment);
    } else {
        res.status(404).send('Department not found');
    }
});

// Delete a department
app.delete('/departments/:id', (req, res) => {
    let departments = readData();
    departments = departments.filter(d => d.id !== parseInt(req.params.id));
    writeData(departments);
    res.status(204).send();
});




// Add  theem emlpoyess to a departments

// app.post('/departments/:id/employees',(req,res)=>{
//     let departments = readData();
//     const department = departments.find(dpar =>dpar.id === parseInt(req.params.id));
//     if(department){
//         const newEmployee = {
//             id:department.employees.length + 1,
//             ...req.body
//         }
//         department.employees.push(newEmployee);
//         writeData(departments);
//         res.status(201).json(newEmployee);
//     }else {
//         res.status(404).send('Department not found');
//     }
   
// })

// // // update 1 employee
// app.put('/departments/:departmentId/employees/:employeeId',(req,res)=>{
//     let departments = readData();
//     const department = departments.find(dpar =>dpar.id === parseInt(req.params.departmentId));
//     if(department){
//         const emlpoyessIndex = department.emlpoyess.findIndex(emId =>emId.id === parseInt(req.params.employeeId));
//          if(emlpoyessIndex !== -1){
//             const upDateEmployees = {
//                 ...department.emlpoyess[emlpoyessIndex],
//                 ...req.body
//             }
//             department.emlpoyess[emlpoyessIndex] = upDateEmployees;
//             writeData(departments);
//             res.json(upDateEmployees);
//          }else{
//             res.status(404).send('Employess not found');
//          }
//     }else{
//         res.status(404).send('Department not found');
//     }
// });


// // //delete 1 employees
// app.delete('/departments/:departmentId/employees/:employeeId', (req, res) => {
//     const departments = readData();
//     const department = departments.find(d => d.id === parseInt(req.params.departmentId));
//     if (department) {
//         department.employees = department.employees.filter(emId => emId.id !== parseInt(req.params.employeeId));
//         writeData(departments);
//         res.status(204).send();
//     } else {
//         res.status(404).send('Department not found');
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
