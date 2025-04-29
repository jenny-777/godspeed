const mysql = require("mysql2");

// Create MySQL Connection
const connection = mysql.createConnection({
  host: '172.29.172.237',
  user: 'remote_user',
  password: 'password',
  database: "university_db"
});

// Connect to Database
connection.connect(err => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = connection;
