const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
const corsOptions = {
    //To allow requests from client
    origin: [
        "http://localhost:3000"
    ],
    credentials: true, // must this flag if you use cookie 
  };
  
app.use(cors(corsOptions));

// Setup router
app.use('/api/v1', require('./app/routes/index'));

// Static Image Folder
app.use('/public', express.static('public'));

// Catch 404 and froward to error handler
app.use(function(req, res, next) {
    next(createError(404, 'Not found page!!!'));
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));

module.exports = app;