const e = require('express');
const express = require('express');
const fs = require('fs');
const router = express.Router();

const departmentFilePath = './data/departments.json';

// Đọc dữ liệu từ file
function readDepartments() {
    return JSON.parse(fs.readFileSync(departmentFilePath));
}

// Ghi dữ liệu vào file
function writeDepartments(data) {
    fs.writeFileSync(departmentFilePath, JSON.stringify(data, null, 2));
}

// Thêm phòng ban
router.post('/departments', (req, res) => {
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
router.put('/departments/:id', (req, res) => {
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
router.delete('/departments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let departments = readDepartments();
    departments = departments.filter(dept => dept.id !== id);
    writeDepartments(departments);
    res.status(204).end();
});

// Tính mức lương trung bình của một phòng ban
router.get('/departments/:id/average-salary', (req, res) => {
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
router.get('/highest-average-salary', (req, res) => {
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
router.get('/directors', (req, res) => {
    const departments = readDepartments();
    const directors = departments.map(dept => ({ directorId: dept.directorId, departmentName: dept.name }));
    res.json(directors);
});

module.exports = router;
