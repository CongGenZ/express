const express = require('express');
const fs = require('fs');
const router = express.Router();

const employeeFilePath = './data/employees.json';

// Đọc dữ liệu từ file
function readEmployees() {
    return JSON.parse(fs.readFileSync(employeeFilePath));
}

// Ghi dữ liệu vào file
function writeEmployees(data) {
    fs.writeFileSync(employeeFilePath, JSON.stringify(data, null, 2));
}

// Thêm nhân viên
router.post('/employees', (req, res) => {
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
router.put('/employees/:id', (req, res) => {
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
router.delete('/employees/ :id', (req, res) => {
    const id = parseInt(req.params.id);
    let employees = readEmployees();
    employees = employees.filter(emp => emp.id !== id);
    writeEmployees(employees);
    res.status(204).end();
});

// Tìm nhân viên có mức lương cao nhất trong phòng ban
router.get('/highest-salary/:departmentId', (req, res) => {
    const departmentId = parseInt(req.params.departmentId);
    const employees = readEmployees();
    const departmentEmployees = employees.filter(emp => emp.departmentId === departmentId);
    if (departmentEmployees.length === 0) {
        return res.status(404).json({ message: 'No employees in this department' });
    }
    const highestSalaryEmployee = departmentEmployees.reduce((prev, curr) => prev.salary > curr.salary ? prev : curr, departmentEmployees[0]);
    res.json(highestSalaryEmployee);
});

module.exports = router;
