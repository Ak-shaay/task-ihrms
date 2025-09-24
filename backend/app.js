const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

var cors = require('cors')
const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;
// Middleware
app.use(bodyParser.json());
// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task'
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});
// Routes
app.post('/api/leave', (req, res) => {
  db.query(`SELECT l.*, e.name 
  FROM leaves l
  JOIN employee e ON l.id = e.id`, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results);
  });
});

app.post('/api/leave/update', (req, res) => {
  const { leave_id, status, comment } = req.body;

  if (!leave_id || !status) {
    return res.status(400).json({ message: "leave_id and status are required" });
  }

  const query = 'UPDATE `leaves` SET leaveStatus = ?, comment = ? WHERE leave_id = ?';

  db.query(query, [status, comment || "", leave_id], (err, result) => {
    if (err) {
      console.error("Error updating leave status:", err);
      return res.status(500).json({ message: "Error updating leave status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json({ message: `Leave request ${leave_id} updated to ${status}` });
  });
});


app.post('/api/leave/id', (req, res) => {
  const { id } = req.body;

  const query = 'SELECT * FROM `leaves` WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching leave records');
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ message: `No leave records found for employee ${id}` });
    }

    res.json(results);
  });
});

app.post('/api/leave/apply', (req, res) => {
  const { id,type, reason, starting, ending, leaveStatus } = req.body;

  if (!id ||!type || !reason || !starting || !ending) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (new Date(starting) > new Date(ending)) {
    return res.status(400).json({ error: "Start date cannot be after end date" });
  }

const sql = "INSERT INTO `leaves` (`id`,`type`, `reason`, `starting`, `ending`, `leaveStatus`) VALUES (?,?, ?, ?, ?, ?)";

  db.query(sql, [id,type, reason, starting, ending, leaveStatus || "Pending"], (err, result) => {
    if (err) {
      console.error("Error inserting leave: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Leave applied successfully"});
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});