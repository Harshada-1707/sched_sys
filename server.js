const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const secretKey = 'your_secret_key';

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "scheduling_system"
})
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    });
  };
// Fetch employees
app.get('/employees', verifyToken, (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Access denied' });
  
    db.query('SELECT id, name FROM employees', (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    });
  });
  
  // Submit schedule
  app.post('/schedule', verifyToken, (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Access denied' });
  
    const { employees, date, time, comment } = req.body;
    const adminId = req.userId;
  
    employees.forEach((employeeId) => {
      db.query(
        'INSERT INTO schedules (admin_id, employee_id, schedule_date, schedule_time, comment) VALUES (?, ?, ?, ?, ?)',
        [adminId, employeeId, date, time, comment],
        (err) => {
          if (err) return res.status(500).json({ error: 'Database error' });
        }
      );
    });
  
    res.json({ message: 'Schedule submitted successfully' });
  });
  
app.post('./signup', (req, res) => {
    const sql = "INSERT INTO login ('name', 'email', 'password') VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err,data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json("User created Successfully");
    })
})
app.post('./login', (req, res) => {
    const sql = "SELECT * FROM login WHERE 'email' = ? AND 'password'= ?" ;
    db.query(sql, [req.body.email,   req.body.password], (err,data) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json("success");
        }else {
            return res.json("failed");
        }
    })
})
app.listen(8081, ()=> {
    console.log("listening");
})