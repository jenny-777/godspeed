const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser')

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {

    const token = req.headers.cookie?.split('=')[1] || req.header('Authorization')?.split(' ')[1];
    // console.log(token);

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Middleware to check admin or not
function checkAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
}

// role ENUM('admin', 'instructor', 'student')
// Register a new user
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error registering user', error: err });
        res.status(201).json({ message: 'User registered', id: result.insertId });
    });
});

// Login a user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM User WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Error logging in', error: err });

        const user = results[0];
        if (!user || !(await bcrypt.compare(password, user.password) || password != user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.ID, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token).json({ token });
    });
});

// Get all users (admin only)
app.get('/users', authenticateToken, checkAdmin, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const query = 'SELECT ID, name, email, role FROM User';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching users', error: err });
        res.json(results);
    });
});

// Delete a user (admin only)
app.delete('/users/:id', authenticateToken, checkAdmin, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const query = 'DELETE FROM User WHERE ID = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting user', error: err });
        res.json({ message: 'User deleted' });
    });
});

// Generic report generator
app.get('/report', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { table, filters } = req.query;
    const query = `SELECT * FROM ${table}${filters ? ` WHERE ${filters}` : ''}`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error generating report', error: err });
        res.json(results);
    });
});

// Get user by ID
app.get('/me', authenticateToken, (req, res) => {
    const query = 'SELECT ID, name, email, role FROM User WHERE ID = ?';
    db.query(query, [req.user.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error while finding user', error: err });
        res.json(result);
    });
});



// **Insert Department**
app.post('/department', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { dept_name, building, budget } = req.body;
    const query = 'INSERT INTO department (dept_name, building, budget) VALUES (?, ?, ?)';
    db.query(query, [dept_name, building, budget], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to insert department', error: err });
        res.json({ message: 'Department added successfully' });
    });
});

// **Insert Course**
app.post('/course', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { course_id, title, dept_name, credits } = req.body;
    const query = 'INSERT INTO course (course_id, title, dept_name, credits) VALUES (?, ?, ?, ?)';
    db.query(query, [course_id, title, dept_name, credits], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to insert course', error: err });
        res.json({ message: 'Course added successfully' });
    });
});

// **Insert Instructor**
app.post('/instructor', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { ID, name, dept_name, salary } = req.body;
    const query = 'INSERT INTO instructor (ID, name, dept_name, salary) VALUES (?, ?, ?, ?)';
    db.query(query, [ID, name, dept_name, salary], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to insert instructor', error: err });
        res.json({ message: 'Instructor added successfully' });
    });
});

// **Insert Student**
app.post('/student', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { ID, name, dept_name, tot_cred } = req.body;
    const query = 'INSERT INTO student (ID, name, dept_name, tot_cred) VALUES (?, ?, ?, ?)';
    db.query(query, [ID, name, dept_name, tot_cred], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to insert student', error: err });
        res.json({ message: 'Student added successfully' });
    });
});

// **Insert Section**
app.post('/section', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { course_id, sec_id, semester, year, building, room_number, time_slot_id } = req.body;
    const query = 'INSERT INTO section (course_id, sec_id, semester, year, building, room_number, time_slot_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [course_id, sec_id, semester, year, building, room_number, time_slot_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to insert section', error: err });
        res.json({ message: 'Section added successfully' });
    });
});

// **Insert Enrollment (Takes)**
app.post('/enroll', authenticateToken, (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });

    const { course_id, sec_id, semester, year, grade } = req.body;
    const query = 'INSERT INTO takes (ID, course_id, sec_id, semester, year, grade) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [req.user.id, course_id, sec_id, semester, year, grade], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to enroll', error: err });
        res.json({ message: 'Enrollment successful' });
    });
});

// **Insert Teaching Assignment (Teaches)**
app.post('/assign', authenticateToken, (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Forbidden' });

    const { course_id, sec_id, semester, year } = req.body;
    const query = 'INSERT INTO teaches (ID, course_id, sec_id, semester, year) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [req.user.id, course_id, sec_id, semester, year], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to assign course', error: err });
        res.json({ message: 'Course assigned successfully' });
    });
});



// Start the server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});