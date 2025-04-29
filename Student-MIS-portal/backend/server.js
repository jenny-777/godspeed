const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db"); // Import MySQL connection

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Student MIS Portal API!");
});

// Sample Route to Fetch Departments
app.get("/departments", (req, res) => {
  const sql = "SELECT * FROM Department";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

// Sample Route to Add a Department
app.post("/departments", (req, res) => {
  const { dept_name, building, budget } = req.body;
  const sql = "INSERT INTO Department (dept_name, building, budget) VALUES (?, ?, ?)";
  db.query(sql, [dept_name, building, budget], (err, result) => {
    if (err) {
      console.error("Error inserting department:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ message: "Department added successfully!", departmentId: result.insertId });
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
