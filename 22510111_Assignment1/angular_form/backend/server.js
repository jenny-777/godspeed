const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '172.29.183.11',
  user: '22510111',
  password: 'password',
  database: 'form_db'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('MySQL connected...');
});

// Fetch list of tables
app.get('/api/tables', (req, res) => {
  db.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      return res.status(500).json({ error: 'Failed to fetch tables' });
    }
    res.json(results.map(row => Object.values(row)[0]));
  });
});

// Fetch data for a specific table
app.get('/api/tables/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  db.query(`SELECT * FROM ??`, [tableName], (err, results) => {
    if (err) {
      console.error(`Error fetching data for table ${tableName}:`, err.message);
      return res.status(500).json({ error: `Failed to fetch data for table ${tableName}` });
    }
    res.json(results);
  });
});

// Create a new table
app.post('/api/tables', (req, res) => {
  const tableName = req.body.tableName;
  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }
  const createTableQuery = `CREATE TABLE ?? (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), value VARCHAR(255))`;
  db.query(createTableQuery, [tableName], (err) => {
    if (err) {
      console.error(`Error creating table ${tableName}:`, err.message);
      return res.status(500).json({ error: `Failed to create table ${tableName}` });
    }
    res.json({ message: 'Table created' });
  });
});

// Add a new row to a table
app.post('/api/tables/:tableName/rows', (req, res) => {
  const tableName = req.params.tableName;
  const rowData = req.body;
  if (!rowData.name || !rowData.value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.query(`INSERT INTO ?? SET ?`, [tableName, rowData], (err) => {
    if (err) {
      console.error(`Error adding row to table ${tableName}:`, err.message);
      return res.status(500).json({ error: `Failed to add row to table ${tableName}` });
    }
    res.json({ message: 'Row added' });
  });
});

// Update a row in a table
app.put('/api/tables/:tableName/rows/:id', (req, res) => {
  const tableName = req.params.tableName;
  const rowId = req.params.id;
  const rowData = req.body;
  if (!rowData.name || !rowData.value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, rowData, rowId], (err) => {
    if (err) {
      console.error(`Error updating row in table ${tableName}:`, err.message);
      return res.status(500).json({ error: `Failed to update row in table ${tableName}` });
    }
    res.json({ message: 'Row updated' });
  });
});

// Delete a row from a table
app.delete('/api/tables/:tableName/rows/:id', (req, res) => {
  const tableName = req.params.tableName;
  const rowId = req.params.id;
  db.query(`DELETE FROM ?? WHERE id = ?`, [tableName, rowId], (err) => {
    if (err) {
      console.error(`Error deleting row from table ${tableName}:`, err.message);
      return res.status(500).json({ error: `Failed to delete row from table ${tableName}` });
    }
    res.json({ message: 'Row deleted' });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//   host: '172.29.183.11',
//   user: '22510111',
//   password: 'password',
//   database: 'form_db'
// });

// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.message);
//     process.exit(1);
//   }
//   console.log('MySQL connected...');
// });

// // Fetch list of tables
// app.get('/api/tables', (req, res) => {
//   db.query('SHOW TABLES', (err, results) => {
//     if (err) {
//       console.error('Error fetching tables:', err.message);
//       return res.status(500).json({ error: 'Failed to fetch tables' });
//     }
//     res.json(results.map(row => Object.values(row)[0]));
//   });
// });

// // Fetch data for a specific table
// app.get('/api/tables/:tableName', (req, res) => {
//   const tableName = req.params.tableName;
//   db.query(`SELECT * FROM ??`, [tableName], (err, results) => {
//     if (err) {
//       console.error(`Error fetching data for table ${tableName}:`, err.message);
//       return res.status(500).json({ error: `Failed to fetch data for table ${tableName}` });
//     }
//     res.json(results);
//   });
// });

// // Create a new table
// app.post('/api/tables', (req, res) => {
//   const tableName = req.body.tableName;
//   const createTableQuery = `CREATE TABLE ?? (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), value VARCHAR(255))`;
//   db.query(createTableQuery, [tableName], (err, results) => {
//     if (err) {
//       console.error(`Error creating table ${tableName}:`, err.message);
//       return res.status(500).json({ error: `Failed to create table ${tableName}` });
//     }
//     res.json({ message: 'Table created' });
//     console.log(`Table ${tableName} created`);
//   });
// });

// // Add a new row to a table
// app.post('/api/tables/:tableName/rows', (req, res) => {
//   const tableName = req.params.tableName;
//   const rowData = req.body;
//   db.query(`INSERT INTO ?? SET ?`, [tableName, rowData], (err, results) => {
//     if (err) {
//       console.error(`Error adding row to table ${tableName}:`, err.message);
//       return res.status(500).json({ error: `Failed to add row to table ${tableName}` });
//     }
//     res.json({ message: 'Row added' });
//   });
// });

// // Update a row in a table
// app.put('/api/tables/:tableName/rows/:id', (req, res) => {
//   const tableName = req.params.tableName;
//   const rowId = req.params.id;
//   const rowData = req.body;
//   db.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, rowData, rowId], (err, results) => {
//     if (err) {
//       console.error(`Error updating row in table ${tableName}:`, err.message);
//       return res.status(500).json({ error: `Failed to update row in table ${tableName}` });
//     }
//     res.json({ message: 'Row updated' });
//   });
// });

// // Delete a row from a table
// app.delete('/api/tables/:tableName/rows/:id', (req, res) => {
//   const tableName = req.params.tableName;
//   const rowId = req.params.id;
//   db.query(`DELETE FROM ?? WHERE id = ?`, [tableName, rowId], (err, results) => {
//     if (err) {
//       console.error(`Error deleting row from table ${tableName}:`, err.message);
//       return res.status(500).json({ error: `Failed to delete row from table ${tableName}` });
//     }
//     res.json({ message: 'Row deleted' });
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err.message);
//   res.status(500).json({ error: 'An unexpected error occurred' });
// });

// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });