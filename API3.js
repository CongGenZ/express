const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// const departmentRoutes = require('./routes/departments');
// const employeeRoutes = require('./routes/employee');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// app.use('/departments', departmentRoutes);
// app.use('/employees', employeeRoutes);


const departmentFilePath = './data/departments.json';
const employeeFilePath = './data/employees.json';

// Đọc dữ liệu từ file
function readEmployees() {
    return JSON.parse(fs.readFileSync(employeeFilePath));
}
// Đọc dữ liệu từ file
function readDepartments() {
    return JSON.parse(fs.readFileSync(departmentFilePath));
}

// Ghi dữ liệu vào file
function writeEmployees(data) {
    fs.writeFileSync(employeeFilePath, JSON.stringify(data, null, 2));
}
// Ghi dữ liệu vào file
function writeDepartments(data) {
    fs.writeFileSync(departmentFilePath, JSON.stringify(data, null, 2));
}







app.post('/departments', (req, res) => {
    const { name, description, directorId } = req.body;
    const departments = readDepartments();
   
    const newDepartment = {
        id: departments.length + 1,
        name,
        description,
        directorId
    };
    departments.push(newDepartment);
    writeDepartments(departments);
    res.status(201).json(newDepartment);
});

// Sửa phòng ban
app.put('/departments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, directorId } = req.body;
    const departments = readDepartments();
    const index = departments.findIndex(dept => dept.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Department not found' });
    }
    departments[index] = { id, name, description, directorId };
    writeDepartments(departments);
    res.json(departments[index]);
});

// Xóa phòng ban
app.delete('/departments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let departments = readDepartments();
    departments = departments.filter(dept => dept.id !== id);
    writeDepartments(departments);
    res.status(204).end();
});

// Tính mức lương trung bình của một phòng ban
app.get('/departments/:id/average-salary', (req, res) => {
    const id = parseInt(req.params.id);
    const employees = JSON.parse(fs.readFileSync('./data/employees.json'));
    const departmentEmployees = employees.filter(emp => emp.departmentId === id);
    if (departmentEmployees.length === 0) {
        return res.status(404).json({ message: 'No employees in this department' });
    }
    const totalSalary = departmentEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    const averageSalary = totalSalary / departmentEmployees.length;
    res.json({ averageSalary });
});

// Tìm phòng ban có mức lương trung bình cao nhất
app.get('/highest-average-salary', (req, res) => {
    const employees = JSON.parse(fs.readFileSync('./data/employees.json'));
    const departments = readDepartments();

    const departmentSalaries = departments.map(department => {
        const departmentEmployees = employees.filter(emp => emp.departmentId === department.id);
        const totalSalary = departmentEmployees.reduce((sum, emp) => sum + emp.salary, 0);
        const averageSalary = departmentEmployees.length > 0 ? totalSalary / departmentEmployees.length : 0;
        return { department, averageSalary };
    });

    const highestSalaryDepartment = departmentSalaries.reduce((prev, curr) => prev.averageSalary > curr.averageSalary ? prev : curr, departmentSalaries[0]);
    res.json(highestSalaryDepartment.department);
});

// Trả về danh sách các trưởng phòng
app.get('/directors', (req, res) => {
    const departments = readDepartments();
    const directors = departments.map(dept => ({ directorId: dept.directorId, departmentName: dept.name }));
    res.json(directors);
});






// Thêm nhân viên
app.post('/employees', (req, res) => {
    const { name, age, departmentId, phone, email, salary } = req.body;
    const employees = readEmployees();
    const newEmployee = {
        id: employees.length + 1,
        name,
        age,
        departmentId,
        phone,
        email,
        salary
    };
    employees.push(newEmployee);
    writeEmployees(employees);
    res.status(201).json(newEmployee);
});

// Sửa nhân viên
app.put('/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, departmentId, phone, email, salary } = req.body;
    const employees = readEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    employees[index] = { id, name, age, departmentId, phone, email, salary };
    writeEmployees(employees);
    res.json(employees[index]);
});

// Xóa nhân viên
app.delete('/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let employees = readEmployees();
    employees = employees.filter(emp => emp.id !== id);
    writeEmployees(employees);
    res.status(204).end();
});

// Tìm nhân viên có mức lương cao nhất trong phòng ban
app.get('/highest-salary/:departmentId', (req, res) => {
    const departmentId = parseInt(req.params.departmentId);
    const employees = readEmployees();
    const departmentEmployees = employees.filter(emp => emp.departmentId === departmentId);
    if (departmentEmployees.length === 0) {
        return res.status(404).json({ message: 'No employees in this department' });
    }
    const highestSalaryEmployee = departmentEmployees.reduce((prev, curr) => prev.salary > curr.salary ? prev : curr, departmentEmployees[0]);
    res.json(highestSalaryEmployee);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
