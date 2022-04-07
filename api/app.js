const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Setup router
app.use('/api/v1', require('./app/routes/index'));

// Static Image Folder
app.use('/images', express.static('./images'))

// Catch 404 and froward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));

module.exports = app;






// const courses= [
//     {id: 1, name: "NodeJS"},
//     {id: 2, name: "ReactJS"}
// ]

// app.get('/api/courses', (req, res) => {
//     res.send(courses);
// })

// app.post('/api/courses/add', (req, res) => {
//     const course = {
//         id : req.body.id,
//         name : req.body.name,
//     }
//     courses.push(course);
//     res.send(JSON.stringify({
//         success: true,
//         notice: "Bạn đã thêm thành công!!!",
//         data: courses
//     }));
// });

// app.put('/api/courses/edit/:id', (req, res) => {
//     const course = courses.find(courses => courses.id === parseInt(req.params.id))
//     course.name = req.body.name
//     res.send(JSON.stringify({
//         success: true,
//         notice: "Bạn đã sửa thành công!!!",
//         data: courses
//     }));
// });

// app.delete('/api/courses/delete/:id', (req, res) => {
//     const course = courses.find(courses => courses.id === parseInt(req.params.id))
//     let index = courses.indexOf(course)
//     courses.splice(index,1)
//     res.send(JSON.stringify({
//         success: true,
//         notice: "Bạn đã xóa thành công!!!",
//         data: courses
//     }));
// })