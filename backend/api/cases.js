// backend/api/cases.js
// Case routes (including NUAR-ready metadata)

const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /cases - list all cases
router.get('/cases', (req, res) => {
  const cases = db.getAllCases();
  res.json(cases);
});

// GET /cases/:id - get single case
router.get('/cases/:id', (req, res) => {
  const id = req.params.id;
  const c = db.getCaseById(id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json(c);
});

// POST /cases - create new case
router.post('/cases', (req, res) => {
  try {
    const payload = req.body || {};

    // Expecting at minimum: urn, title, description
    if (!payload.urn || !payload.title) {
      return res.status(400).json({ error: 'urn and title are required' });
    }

    const newCase = db.createNewCase({
      urn: payload.urn,
      title: payload.title,
      description: payload.description || '',
      status: payload.status || 'open',
      corridorId: payload.corridorId || null,
      corridorName: payload.corridorName || null,
      location: payload.location || null,
      weather: payload.weather || null,
      operator: payload.operator || null,
      nuar: payload.nuar || null, // NUAR metadata block
    });

    res.status(201).json(newCase);
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// POST /cases/:id/reopen - reopen a case
router.post('/cases/:id/reopen', (req, res) => {
  const id = req.params.id;
  const updated = db.reopenCase(id);
  if (!updated) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json(updated);
});

module.exports = router;
