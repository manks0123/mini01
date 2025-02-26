const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret',    
  resave: false,                  
  saveUninitialized: true,      
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,               
    maxAge: 24 * 60 * 60 * 1000 
  }      
}));


const port = process.env.PORT || 3001;

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL", err);
    return;
  }
  console.log("Connected to MySQL");
});
// // ดึงข้อมูลเซ็นเซอร์ล่าสุด
// app.get("/api/sensors", (req, res) => {
//   db.query(
//     "SELECT * FROM Sensor_Data ORDER BY timestamp DESC LIMIT 10",
//     (err, result) => {
//       if (err) {
    
//     console.error("Error fetching sensor data", err);
//         res.status(500).send(err);
//       } else {
//         res.json(result);
//       }
//     }
//   );
// });

// เพิ่มพืช
app.post("/api/plants/add", (req, res) => {
  const { plant_name, plant_season, growth_stage, area_id } = req.body;

  if (!plant_name || !plant_season || !growth_stage || !area_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Received data:", req.body);

  const query = `
    INSERT INTO Plant (Plant_Name, Plant_season, Growth_stage, Area_ID)
    VALUES (?, ?, ?, ?)`;

  db.query(query, [plant_name, plant_season, growth_stage, area_id], (err, result) => {
    if (err) {
      console.error("Error adding plant:", err);
      return res.status(500).json({ error: "Error adding plant" });
    }

    console.log("Plant added successfully:", result);
    res.status(201).json({ message: "Plant added successfully", plantId: result.insertId });
  });
});



app.delete("/api/plants/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM Plant WHERE plant_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting plant", err);
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send({ message: "Plant not found" });
    } else {
      res.send({ message: "Plant deleted successfully" });
    }
  });
});

app.put("/api/plants/:id", (req, res) => {
  const { id } = req.params;
  const { plant_name, plant_season, growth_stage, area_id } = req.body; 

  if (!plant_name || !plant_season || !growth_stage || !area_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    UPDATE Plant
    SET Plant_Name = ?, Plant_season = ?, Growth_stage = ?, Area_ID = ?
    WHERE Plant_ID = ?`;

  db.query(query, [plant_name, plant_season, growth_stage, area_id, id], (err, result) => {
    if (err) {
      console.error("Error updating plant:", err);
      return res.status(500).json({ error: "Error updating plant", details: err });
    } 

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.json({ message: "Plant updated successfully" });
  });
});

app.get("/api/plants", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.search || "";
  const sortBy = req.query.sortBy || "Plant_ID";
  const sortOrder = req.query.sortOrder || "ASC";
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      error: "Invalid pagination parameters"
    });
  }

  let query = "SELECT * FROM Plant";
  let countQuery = "SELECT COUNT(*) AS total FROM Plant";
  let queryParams = [];
  
  if (searchTerm) {
    query += " WHERE Plant_Name LIKE ? OR Plant_season LIKE ?";
    countQuery += " WHERE Plant_Name LIKE ? OR Plant_season LIKE ?";
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }
  
  query += ` ORDER BY ${sortBy} ${sortOrder}`;
  
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  db.query(countQuery, queryParams.slice(0, 2), (err, countResults) => {
    if (err) {
      console.error("Error fetching total count", err);
      return res.status(500).json({
        error: "Database error when fetching count",
        details: err.message
      });
    }

    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error("Error fetching plants", err);
        return res.status(500).json({
          error: "Database error when fetching plants",
          details: err.message
        });
      } else {
        res.json({
          plants: results,
          pagination: {
            totalRecords,
            totalPages,
            currentPage: page,
            limit,
          },
        });
      }
    });
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
