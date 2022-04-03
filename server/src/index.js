const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const { engine } = require('express-handlebars');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(morgan('combined'))
app.engine('hbs', engine());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'login-register'
});


app.post('/register', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "INSERT INTO member (username, password) VALUES (?,?)",
    [username, password],
    (err, result) => {
      console.log(err);
      result.send("Connect to");
    })
});


app.post('/login', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT id FROM member WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if(err){
        res.send({err: err});
      }
      else{
        if(result.length > 0){
          res.send(result);
        }
        else{
          res.send({message: "Sai tài khoản hoặc password !!!"});
        }
      }
    }
  )
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})