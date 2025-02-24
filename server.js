const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "mini",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL", err);
    return;
  }
  console.log("Connected to MySQL");
});

// ดึงข้อมูลเซ็นเซอร์ล่าสุด
app.get("/api/sensors", (req, res) => {
  db.query(
    "SELECT * FROM Sensor_Data ORDER BY timestamp DESC LIMIT 10",
    (err, result) => {
      if (err) {
        console.error("Error fetching sensor data", err);
        res.status(500).send(err);
      } else {
        res.json(result);
      }
    }
  );
});



// POST: เพิ่มพืช
app.post("/api/plants", (req, res) => {
  const { plant_id, plant_name, plant_season, growth_stage, area_id } = req.body;

  // คำสั่ง SQL สำหรับการเพิ่มพืช (รวม plant_id ที่ระบุไว้)
  const query = `
    INSERT INTO Plant (plant_id, plant_name, plant_season, growth_stage, plantation_area_id)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [plant_id, plant_name, plant_season, growth_stage, area_id], (err, result) => {
    if (err) {
      console.error("Error adding plant", err);
      res.status(500).send("Error adding plant");
    } else {
      res.status(200).send("Plant added successfully");
    }
  });
});



// ลบข้อมูลพืช
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

// อัปเดตข้อมูลพืช
app.put("/api/plants/:id", (req, res) => {
  const { id } = req.params;
  const { plant, plant_season, growth_stage, plantation_area_id } = req.body;

  const query = `
    UPDATE Plant
    SET plant = ?, plant_season = ?, growth_stage = ?, plantation_area_id = ?
    WHERE plant_id = ?`;

  db.query(query, [plant, plant_season, growth_stage, plantation_area_id, id], (err, result) => {
    if (err) {
      console.error("Error updating plant", err);
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send({ message: "Plant not found" });
    } else {
      res.send({ message: "Plant updated successfully" });
    }
  });
});

// ดึงข้อมูลพืชที่เพิ่มล่าสุด
app.get("/api/plants", (req, res) => {
  db.query("SELECT * FROM Plant ORDER BY Plant_ID DESC LIMIT 1", (err, result) => {
    if (err) {
      console.error("Error fetching plant data", err);
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
