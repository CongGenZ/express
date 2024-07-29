// app.js

const express = require('express');
const app = express();
const port = 3000; // Bạn có thể chọn cổng khác nếu muốn

// Middleware để xử lý JSON và URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định nghĩa một route đơn giản
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Định nghĩa một route khác
app.get('/about', (req, res) => {
  res.send('About Page');
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
