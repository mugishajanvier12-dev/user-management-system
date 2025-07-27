// Import express
const express = require('express');

// Create an Express app
const app = express();

// Set the port for the server
const port = 5000;  // You can change this to any port you prefer

// Import Cors
const cors = require('cors');

// Middleware to handle JSON requests
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));

const mysql = require('mysql');

// Database connection
const connectDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ssm'
});

connectDB.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }
  console.log("Database connected successfully!");
});

// --- STAFF MANAGEMENT ROUTES ---

// Get all users
app.get('/getUser', (req, res) => {
  const query = "SELECT * FROM `staff`";
  connectDB.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// Delete a user
app.delete('/removeUser/:id', (req, res) => {
  const sql = "DELETE FROM `staff` WHERE staffID=?";
  const id = req.params.id;
  connectDB.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error inside Server" });
    res.json({ message: "User removed successfully" });
  });
});

// Update a user
app.put('/updateUser/:id', (req, res) => {
  const { Name, Role, Departement, Email, Phone } = req.body;
  const userId = req.params.id;

  if (!Name || !Role || !Departement || !Email || !Phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "UPDATE staff SET Name=?, Role=?, Departement=?, Email=?, Phone=? WHERE staffID=?";
  connectDB.query(sql, [Name, Role, Departement, Email, Phone, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating staff" });
    res.json({ message: "User updated successfully" });
  });
});

// Create a new user
app.post('/createUser', (req, res) => {
  const { name, role, department, email, phone } = req.body;

  if (!name || !role || !department || !email || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO `staff` (Name, Role, Departement, Email, Phone) VALUES (?, ?, ?, ?, ?)";
  connectDB.query(sql, [name, role, department, email, phone], (err, result) => {
    if (err) return res.status(500).json({ message: "Error adding staff" });
    res.json({ message: "User added successfully" });
  });
});

// --- STOCK MANAGEMENT ROUTES ---

// Get all stock items
app.get('/stock', (req, res) => {
  const sql = "SELECT * FROM stock_items";
  connectDB.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// Get a single stock item by ID
app.get('/stock/:id', (req, res) => {
  const sql = "SELECT * FROM stock_items WHERE id=?";
  const id = req.params.id;
  connectDB.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result[0]);
  });
});

// Add a new stock item
app.post('/stock', (req, res) => {
  const { name, category, department, quantity } = req.body;

  if (!name || !category || !department || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO stock_items (name, category, department, quantity) VALUES (?, ?, ?, ?)";
  connectDB.query(sql, [name, category, department, quantity], (err, result) => {
    if (err) return res.status(500).json({ message: "Error adding stock item" });
    res.json({ message: "Stock item added successfully" });
  });
});

// Update a stock item
app.put('/stock/:id', (req, res) => {
  const { name, category, department, quantity } = req.body;
  const id = req.params.id;

  if (!name || !category || !department || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "UPDATE stock_items SET name=?, category=?, department=?, quantity=? WHERE id=?";
  connectDB.query(sql, [name, category, department, quantity, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating stock item" });
    res.json({ message: "Stock item updated successfully" });
  });
});

// Delete a stock item
app.delete('/stock/:id', (req, res) => {
  const sql = "DELETE FROM stock_items WHERE id=?";
  const id = req.params.id;
  connectDB.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting stock item" });
    res.json({ message: "Stock item removed successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
