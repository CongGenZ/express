// app.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Bạn có thể chọn cổng khác nếu muốn

// Middleware để xử lý JSON và URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// Định nghĩa một route khác
// app.get('/about', (req, res) => {
//   res.send('About Page 1');
// });

// Middleware để xử lý JSON và URL-encoded data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));




// Định nghĩa một route post
app.get('/posts', (req, res) => {
  res.send('Return posts successfully');
});


app.get('/post/:id', (req,res)=>{
    const postId = req.params.id;
    res.send(`This is post with id: ${postId}`)
})


app.post('/post/:id',(req,res)=>{
    const postId = req.params.id;
    const { title, content , author} = req.body;

    const post = {
        data: {
            tile: title ,
            content: content,
            author: author
          },
          message: "User created successfully"
        };
      
        res.json(post);
    }
);


app.put('put/:id',(req,res)=>{
    const postId = req.params.id;
    const { title, content , author} = req.body;
    const put = {
        data: {
            tile: title ,
            content: content,
            author: author
          },
          message: "Post updated successfull"
        };
      
        res.json(put);

});
app.patch('/post/:id', (req, res)=> {
    const postId = req.params.id;
    const { tile} =req.body
    const patch = {
        data: {
          tile: tile ,
        },
        message: "Post updated successfully"
      };
    
      res.json(patch);
})
app.delete('/post/:id', (req, res) => {
    const postId = req.params.id;
    res.send(`Deleted post with id: ${postId} successfully!`)
} )

// res.status(201).json({
//     data : post,
//     message :`Post with id: ${postId} created successfully`
// })
// Định nghĩa một route đơn giản
// app.get('/', (req, res) => {
//     res.send('CongDepZai12334 IT, Express!');
//   });

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });