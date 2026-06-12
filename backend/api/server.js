// backend/api/server.js
// Express server for VERITAS‑1.0‑DEMO
// Fixed port binding (4000) and full CORS support

const express = require('express');
const cors = require('cors');

// --- ROUTE IMPORTS ----------------------------------------------------------
const casesRoutes = require('./cases');
const evidenceRoutes = require('./evidence');
const nuarRoutes = require('./nuar');
const simulationRoutes = require('./simulation');

// --- APP INITIALISATION -----------------------------------------------------
const app = express();
const PORT = 4000; // fixed port, no environment override

app.use(cors());
app.use(express.json());

// --- HEALTH CHECK -----------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'veritas-backend' });
});

// --- LOGIN ENDPOINT ---------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { pin } = req.body;
  if (pin === '1937') {
    res.status(200).json({ message: 'Login successful', role: 'super-admin' });
  } else {
    res.status(401).json({ message: 'Invalid PIN' });
  }
});

// --- LOCKOUT NOTIFICATION ---------------------------------------------------
app.post('/api/notify-lockout', (req, res) => {
  const { deviceId, timestamp } = req.body;
  console.log(`LOCKOUT ALERT: Device ${deviceId} at ${timestamp}`);
  res.status(200).json({ message: 'Lockout notification received' });
});

// --- ROUTE MOUNTING ---------------------------------------------------------
app.use(casesRoutes);
app.use(evidenceRoutes);
app.use(nuarRoutes);
app.use(simulationRoutes);

// --- SERVER START -----------------------------------------------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VERITAS backend listening on http://localhost:${PORT}`);
});
