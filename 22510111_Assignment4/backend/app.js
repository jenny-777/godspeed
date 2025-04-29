const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

// Middleware: Authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers.cookie?.split('=')[1] || req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware: Check if user is a teacher
function checkTeacher(req, res, next) {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied: Teachers only' });
  }
  next();
}

app.get('/me', authenticateToken, (req, res) => {
  const query = 'SELECT user_id, full_name, email, role FROM Users WHERE user_id = ?';

  db.query(query, [req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error while finding user', error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'IN me User not found' });
    }

    res.json(result[0]); // Return a single user object instead of an array
  });
});


// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM Users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error logging in', error: err });

    const user = results[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash) || password == user.password_hash)) {
      if (!user) {
        console.log("User not found");
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, { httpOnly: true }).json({ token });
  });
});

// Teachers: Add Student
app.post('/users/add-student', authenticateToken, checkTeacher, async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO Users (full_name, email, password_hash, role) VALUES (?, ?, ?, "student")';

    db.query(query, [full_name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Error adding student', error: err });
      res.json({ message: 'Student added successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error hashing password', error });
  }
});

// Get All Students (Teacher only)
app.get('/users/students', authenticateToken, checkTeacher, (req, res) => {
  const query = 'SELECT user_id, full_name, email FROM Users WHERE role = "student"';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching students', error: err });
    res.json(results);
  });
});

// Create an Exam (Teacher only)
app.post('/create-exams', authenticateToken, checkTeacher, (req, res) => {
  const { exam_name, start_time, end_time, duration_minutes } = req.body;
  const query = 'INSERT INTO Exams (exam_name, created_by, start_time, end_time, duration_minutes) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [exam_name, req.user.id, start_time, end_time, duration_minutes], (err) => {
    if (err) return res.status(500).json({ message: 'Error creating exam', error: err });
    res.json({ message: 'Exam created successfully' });
  });
});

app.get('/exams', (req, res) => {
  // const {exam_name, start_time, end_time, duration_minutes} = req.body;
  const query = 'SELECT * FROM Exams';

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error retriving exams', error: err });
    res.json(results);
  })
});


app.get('/users', authenticateToken, checkTeacher, (req, res) => {
  // if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access denied' });

  const query = 'SELECT user_id, name, email, role FROM Users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users', error: err });
    res.json(results);
  });
});

// // Add Question to Exam (Teacher only)
// app.post('/questions', authenticateToken, checkTeacher, (req, res) => {
//   const { question_text, option_a, option_b, option_c, option_d, correct_option, image_url, math_expression } = req.body;
//   const query = 'INSERT INTO Questions (question_text, option_a, option_b, option_c, option_d, correct_option, image_url, math_expression, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

//   db.query(query, [question_text, option_a, option_b, option_c, option_d, correct_option, image_url, math_expression, req.user.id], (err) => {
//     if (err) return res.status(500).json({ message: 'Error adding question', error: err });
//     res.json({ message: 'Question added successfully' });
//   });
// });

// Get All Questions (Teacher only)
app.get('/questions', authenticateToken, checkTeacher, (req, res) => {
  const query = 'SELECT * FROM Questions';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching questions', error: err });
    res.json(results);
  });
});

app.post('/questions', authenticateToken, checkTeacher, (req, res) => {
  const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
  image_url = req.body.image_url ||'';
  math_expression = req.body.math_expression || "";
  const query = 'INSERT into Questions (question_text, option_a, option_b, option_c, option_d, correct_option, image_url, math_expression, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
 
  db.query(query, [question_text, option_a, option_b, option_c, option_d, correct_option, image_url, math_expression, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error adding question', error: err });
    res.json({ message: 'Question added successfully' });
  });
});


// Student: Take Exam (Start Attempt)
app.post('/exams/start/:exam_id', authenticateToken, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only' });

  const exam_id = req.params.exam_id;
  const query = 'INSERT INTO Student_Exam_Attempts (student_id, exam_id, status) VALUES (?, ?, "ongoing")';

  db.query(query, [req.user.id, exam_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error starting exam', error: err });
    res.json({ message: 'Exam started', attempt_id: result.insertId });
  });
});

// Student: Submit Answer
app.post('/exams/answer', authenticateToken, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only' });

  const { attempt_id, question_id, selected_option } = req.body;
  const query = 'INSERT INTO Student_Responses (attempt_id, question_id, selected_option, is_correct) SELECT ?, ?, ?, (correct_option = ?) FROM Questions WHERE question_id = ?';

  db.query(query, [attempt_id, question_id, selected_option, selected_option, question_id], (err) => {
    if (err) return res.status(500).json({ message: 'Error submitting answer', error: err });
    res.json({ message: 'Answer submitted' });
  });
});

// Student: Finish Exam
app.post('/exams/finish/:attempt_id', authenticateToken, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only' });

  const attempt_id = req.params.attempt_id;
  const query = 'UPDATE Student_Exam_Attempts SET status = "completed", end_time = NOW() WHERE attempt_id = ?';

  db.query(query, [attempt_id], (err) => {
    if (err) return res.status(500).json({ message: 'Error finishing exam', error: err });
    res.json({ message: 'Exam completed' });
  });
});

// Get Dashboard (Teacher only)
app.get('/dashboard', authenticateToken, checkTeacher, (req, res) => {
  const query = `
    SELECT 
      e.exam_name, 
      COUNT(s.attempt_id) AS total_students,
      SUM(CASE WHEN s.status = 'ongoing' THEN 1 ELSE 0 END) AS ongoing,
      SUM(CASE WHEN s.status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN s.status = 'terminated' THEN 1 ELSE 0 END) AS terminated
    FROM Exams e 
    LEFT JOIN Student_Exam_Attempts s ON e.exam_id = s.exam_id
    GROUP BY e.exam_id;
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching dashboard', error: err });
    res.json(results);
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
