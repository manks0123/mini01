// โหลดโมดูลที่จำเป็น
const express = require("express");         
const mysql = require("mysql2");            
const cors = require("cors");              
require("dotenv").config();                 
const session = require('express-session'); 
const cookieParser = require('cookie-parser'); 

// ตั้งค่า Express
const app = express();
app.use(cors());                          
app.use(express.json());                 
app.use(cookieParser());                 
app.use(express.urlencoded({ extended: true })); // แปลงข้อมูลฟอร์ม

// ตั้งค่าการจัดการเซสชั่น
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

// ตั้งค่าพอร์ตเซิร์ฟเวอร์
const port = process.env.PORT || 3001;

// การตั้งค่าการเชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,              
  user: process.env.DB_USER,              
  password: process.env.DB_PASSWORD,      
  database: process.env.DB_NAME,         
  port: process.env.DB_PORT,              
});

// ทดสอบการเชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL", err);
    return;
  }
  console.log("Connected to MySQL");
});

// API endpoint - เพิ่มข้อมูลพืช (CREATE)
app.post("/api/plants/add", (req, res) => {
  const { plant_name, plant_season, growth_stage, area_id } = req.body;

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
  if (!plant_name || !plant_season || !growth_stage || !area_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Received data:", req.body);

  // สร้างคำสั่ง SQL สำหรับเพิ่มข้อมูล
  const query = `
    INSERT INTO Plant (Plant_Name, Plant_season, Growth_stage, Area_ID)
    VALUES (?, ?, ?, ?)`;

  // ส่งคำขอไปยังฐานข้อมูล MySQL
  db.query(query, [plant_name, plant_season, growth_stage, area_id], (err, result) => {
    if (err) {
      console.error("Error adding plant:", err);
      return res.status(500).json({ error: "Error adding plant" });
    }

    console.log("Plant added successfully:", result);
    res.status(201).json({ message: "Plant added successfully", plantId: result.insertId });
  });
});



// API endpoint - ลบข้อมูลพืช (DELETE)
app.delete("/api/plants/:id", (req, res) => {
  const { id } = req.params;  // รับ ID จาก URL parameter

  // สร้างคำสั่ง SQL สำหรับลบข้อมูล
  const query = "DELETE FROM Plant WHERE plant_id = ?";

  // ส่งคำขอไปยังฐานข้อมูล MySQL
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting plant", err);
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      // ไม่พบข้อมูลพืชที่ต้องการลบ
      res.status(404).send({ message: "Plant not found" });
    } else {
      // ลบสำเร็จ
      res.send({ message: "Plant deleted successfully" });
    }
  });
});



// API endpoint - อัปเดตข้อมูลพืช (UPDATE)
app.put("/api/plants/:id", (req, res) => {
  const { id } = req.params;  // รับ ID จาก URL parameter
  const { plant_name, plant_season, growth_stage, area_id } = req.body; 

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
  if (!plant_name || !plant_season || !growth_stage || !area_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // สร้างคำสั่ง SQL สำหรับอัปเดตข้อมูล
  const query = `
    UPDATE Plant
    SET Plant_Name = ?, Plant_season = ?, Growth_stage = ?, Area_ID = ?
    WHERE Plant_ID = ?`;

  // ส่งคำขอไปยังฐานข้อมูล MySQL
  db.query(query, [plant_name, plant_season, growth_stage, area_id, id], (err, result) => {
    if (err) {
      console.error("Error updating plant:", err);
      return res.status(500).json({ error: "Error updating plant", details: err });
    } 

    if (result.affectedRows === 0) {
      // ไม่พบข้อมูลพืชที่ต้องการอัปเดต
      return res.status(404).json({ message: "Plant not found" });
    }

    // อัปเดตสำเร็จ
    res.json({ message: "Plant updated successfully" });
  });
});



// API endpoint - ดึงข้อมูลพืชทั้งหมดพร้อมการค้นหาและแบ่งหน้า (READ)
app.get("/api/plants", (req, res) => {
  // รับพารามิเตอร์จากคำขอ
  const page = parseInt(req.query.page) || 1;             
  const limit = parseInt(req.query.limit) || 10;          
  const offset = (page - 1) * limit;                      
  const searchTerm = req.query.search || "";              
  const sortBy = req.query.sortBy || "Plant_ID";          
  const sortOrder = req.query.sortOrder || "ASC";         
  
  // ตรวจสอบความถูกต้องของพารามิเตอร์การแบ่งหน้า
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      error: "Invalid pagination parameters"
    });
  }

  // เตรียมคำสั่ง SQL
  let query = "SELECT * FROM Plant";
  let countQuery = "SELECT COUNT(*) AS total FROM Plant";
  let queryParams = [];
  
  // เพิ่มเงื่อนไขการค้นหา 
  if (searchTerm) {
    query += " WHERE Plant_Name LIKE ? ";
    countQuery += " WHERE Plant_Name LIKE ? ";
    queryParams.push(`%${searchTerm}%`);
  }
  
  // เพิ่มการเรียงลำดับ
  query += ` ORDER BY ${sortBy} ${sortOrder}`;
  
  // เพิ่มการแบ่งหน้า
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  // นับจำนวนรายการทั้งหมดสำหรับการแบ่งหน้า
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

    // ดึงข้อมูลพืช
    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error("Error fetching plants", err);
        return res.status(500).json({
          error: "Database error when fetching plants",
          details: err.message
        });
      } else {
        // ส่งข้อมูลพืชและข้อมูลการแบ่งหน้ากลับไปยังไคลเอนต์
        res.json({
          plants: results,                // ข้อมูลพืช
          pagination: {                   // ข้อมูลการแบ่งหน้า
            totalRecords,                 // จำนวนรายการทั้งหมด
            totalPages,                   // จำนวนหน้าทั้งหมด
            currentPage: page,            // หน้าปัจจุบัน
            limit,                        // จำนวนรายการต่อหน้า
          },
        });
      }
    });
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});