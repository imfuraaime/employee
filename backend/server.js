const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'smartpark_super_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Add your local MySQL root password here if applicable
    database: 'EPRMS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('═'.repeat(50));
        console.log('🚀 Successfully connected to MySQL Database: EPRMS');
        console.log('═'.repeat(50));
        connection.release();
    }
});

// Auth Middleware to protect sensitive endpoints
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
};

/* ==========================================================================
   1. AUTHENTICATION ENDPOINTS (For Thunder Client testing)
   ========================================================================== */

// Register Admin Route
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Username or Email already exists.' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Admin user registered successfully!', userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Login Admin Route
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password.' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: 'Invalid username or password.' });

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid username or password.' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ message: 'Login successful!', token, username: user.username });
    });
});


/* ==========================================================================
   2. DEPARTMENT ENDPOINTS
   ========================================================================== */

app.get('/api/departments', (req, res) => {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/departments', (req, res) => {
    const { departmentcode, departmentname, grosssalary } = req.body;
    const query = 'INSERT INTO department (departmentcode, departmentname, grosssalary) VALUES (?, ?, ?)';
    db.query(query, [departmentcode, departmentname, grosssalary], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Department added successfully' });
    });
});

app.put('/api/departments/:code', (req, res) => {
    const { departmentname, grosssalary } = req.body;
    const query = 'UPDATE department SET departmentname = ?, grosssalary = ? WHERE departmentcode = ?';
    db.query(query, [departmentname, grosssalary, req.params.code], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Department updated successfully' });
    });
});

app.delete('/api/departments/:code', (req, res) => {
    db.query('DELETE FROM department WHERE departmentcode = ?', [req.params.code], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Department deleted successfully' });
    });
});


/* ==========================================================================
   3. EMPLOYEE ENDPOINTS
   ========================================================================== */

app.get('/api/employees', (req, res) => {
    const query = `
        SELECT e.*, d.departmentname 
        FROM employee e 
        LEFT JOIN department d ON e.departmentcode = d.departmentcode
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/employees', (req, res) => {
    const { employeenumber, firstname, lastname, position, address, telephone, gender, hireddate, departmentcode } = req.body;
    const query = `INSERT INTO employee (employeenumber, firstname, lastname, position, address, telephone, gender, hireddate, departmentcode) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [employeenumber, firstname, lastname, position, address, telephone, gender, hireddate, departmentcode], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Employee added successfully' });
    });
});

app.put('/api/employees/:id', (req, res) => {
    const { firstname, lastname, position, address, telephone, gender, hireddate, departmentcode } = req.body;
    const query = `UPDATE employee SET firstname = ?, lastname = ?, position = ?, address = ?, telephone = ?, gender = ?, hireddate = ?, departmentcode = ? 
                   WHERE employeenumber = ?`;
    db.query(query, [firstname, lastname, position, address, telephone, gender, hireddate, departmentcode, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee updated successfully' });
    });
});

app.delete('/api/employees/:id', (req, res) => {
    db.query('DELETE FROM employee WHERE employeenumber = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee deleted successfully' });
    });
});


/* ==========================================================================
   4. SALARY ENDPOINTS
   ========================================================================== */

app.get('/api/salaries', (req, res) => {
    const query = `
        SELECT s.*, e.firstname, e.lastname, d.departmentname 
        FROM salary s
        JOIN employee e ON s.employeenumber = e.employeenumber
        LEFT JOIN department d ON e.departmentcode = d.departmentcode
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Fetches gross salary auto-refill details when an employee is selected in frontend dropdowns
app.get('/api/salaries/employee-lookup/:empNum', (req, res) => {
    const query = `
        SELECT d.grosssalary 
        FROM employee e 
        JOIN department d ON e.departmentcode = d.departmentcode 
        WHERE e.employeenumber = ?
    `;
    db.query(query, [req.params.empNum], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Employee or linked department not found' });
        res.json(results[0]);
    });
});

app.post('/api/salaries', (req, res) => {
    const { employeenumber, grosssalary, totaldeduction, month } = req.body;
    const query = 'INSERT INTO salary (employeenumber, grosssalary, totaldeduction, month) VALUES (?, ?, ?, ?)';
    db.query(query, [employeenumber, grosssalary, totaldeduction, month], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Salary tracked successfully' });
    });
});

app.put('/api/salaries/:id', (req, res) => {
    const { grosssalary, totaldeduction, month } = req.body;
    const query = 'UPDATE salary SET grosssalary = ?, totaldeduction = ?, month = ? WHERE id = ?';
    db.query(query, [grosssalary, totaldeduction, month, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Salary layout record updated' });
    });
});

app.delete('/api/salaries/:id', (req, res) => {
    db.query('DELETE FROM salary WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Salary entry removed' });
    });
});


/* ==========================================================================
   5. DASHBOARD SUMMARY ENDPOINT
   ========================================================================== */

app.get('/api/dashboard/stats', (req, res) => {
    const queries = {
        totalEmployees: 'SELECT COUNT(*) as count FROM employee',
        totalDepartments: 'SELECT COUNT(*) as count FROM department',
        totalPayrollThisMonth: 'SELECT IFNULL(SUM(netsalary), 0) as total FROM salary'
    };

    db.query(queries.totalEmployees, (err1, r1) => {
        if (err1) return res.status(500).json({ error: err1.message });
        db.query(queries.totalDepartments, (err2, r2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            db.query(queries.totalPayrollThisMonth, (err3, r3) => {
                if (err3) return res.status(500).json({ error: err3.message });
                
                res.json({
                    employees: r1[0].count,
                    departments: r2[0].count,
                    totalPayout: r3[0].total
                });
            });
        });
    });
});


/* ==========================================================================
   6. PAYMENTS & REPORTING ENDPOINTS
   ========================================================================== */

// Serves both composite payment view and month-filtered reports
app.get('/api/reports/monthly', (req, res) => {
    const { month } = req.query;
    let query = `
        SELECT e.firstname, e.lastname, e.position, d.departmentname, s.grosssalary, s.totaldeduction, s.netsalary, s.month
        FROM salary s
        JOIN employee e ON s.employeenumber = e.employeenumber
        JOIN department d ON e.departmentcode = d.departmentcode
    `;
    
    const params = [];
    if (month) {
        query += ' WHERE s.month = ?';
        params.push(month);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`📡 EPRMS API Server runtime actively streaming on port ${PORT}`);
});