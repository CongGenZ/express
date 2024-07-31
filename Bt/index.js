const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware để xử lý JSON
app.use(express.json());

// Đường dẫn đến file dữ liệu
const dataFilePath = './data/departments.json';

// Đọc dữ liệu từ file
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Ghi dữ liệu vào file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Lấy danh sách tất cả các phòng ban
app.get('/departments', (req, res) => {
  const departments = readData();
  res.json(departments);
});

// Lấy thông tin của một phòng ban theo ID
app.get('/departments/:id', (req, res) => {
  const departments = readData();
  const department = departments.find(d => d.id === parseInt(req.params.id));
  if (department) {
    res.json(department);
  } else {
    res.status(404).send('Department not found');
  }
});

// Thêm mới một phòng ban
app.post('/departments', (req, res) => {
  const departments = readData();
  const newDepartment = {
    id: departments.length + 1, // Đơn giản hoá việc tạo ID
    name: req.body.name,
    description: req.body.description,
    directorId: req.body.directorId
  };
  departments.push(newDepartment);
  writeData(departments);
  res.status(201).json(newDepartment);
});

// Cập nhật thông tin của một phòng ban
app.put('/departments/:id', (req, res) => {
  const departments = readData();
  const departmentIndex = departments.findIndex(d => d.id === parseInt(req.params.id));
  if (departmentIndex !== -1) {
    departments[departmentIndex] = {
      id: departments[departmentIndex].id,
      name: req.body.name || departments[departmentIndex].name,
      description: req.body.description || departments[departmentIndex].description,
      directorId: req.body.directorId || departments[departmentIndex].directorId
    };
    writeData(departments);
    res.json(departments[departmentIndex]);
  } else {
    res.status(404).send('Department not found');
  }
});

// Xóa một phòng ban
app.delete('/departments/:id', (req, res) => {
  let departments = readData();
  departments = departments.filter(d => d.id !== parseInt(req.params.id));
  writeData(departments);
  res.status(204).send();
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
