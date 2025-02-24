const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());
const port = 3000;

// เชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'mini'
});

db.connect((err) => {
  if (err){ console.err("Error connectingv to MySQL",err);
  return;
  }
  console.log('Connected to MySQL');
})

