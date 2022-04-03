const createError = require('http-errors');
const express = require('express');
require('dotenv').config();

const app = express()
app.use(express.json());

// Config path
const pathConfig = require('./path');
global.__base       = __dirname + '/';
global.__path_app   = __base + pathConfig.folder_app + '/';

global.__path_schemas       = __path_app + pathConfig.folder_schemas + '/';
global.__path_models        = __path_app + pathConfig.folder_models  + '/';
global.__path_routers       = __path_app + pathConfig.folder_routers + '/';
global.__path_configs       = __path_app + pathConfig.folder_configs + '/';

// Connected to database
const db = require(__path_configs + 'database');

// Setup router
app.use('/api/v1', require(__path_routers));

// Catch 404 and froward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.end('Error App');
});

module.exports = app;






const courses= [
    {id: 1, name: "NodeJS"},
    {id: 2, name: "ReactJS"}
]

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.post('/api/courses/add', (req, res) => {
    const course = {
        id : req.body.id,
        name : req.body.name,
    }
    courses.push(course);
    res.send(JSON.stringify({
        success: true,
        notice: "Bạn đã thêm thành công!!!",
        data: courses
    }));
});

app.put('/api/courses/edit/:id', (req, res) => {
    const course = courses.find(courses => courses.id === parseInt(req.params.id))
    course.name = req.body.name
    res.send(JSON.stringify({
        success: true,
        notice: "Bạn đã sửa thành công!!!",
        data: courses
    }));
});

app.delete('/api/courses/delete/:id', (req, res) => {
    const course = courses.find(courses => courses.id === parseInt(req.params.id))
    let index = courses.indexOf(course)
    courses.splice(index,1)
    res.send(JSON.stringify({
        success: true,
        notice: "Bạn đã xóa thành công!!!",
        data: courses
    }));
})

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));