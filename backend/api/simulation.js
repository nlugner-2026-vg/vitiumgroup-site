// backend/api/simulation.js
// Simple WIJ-style simulation endpoint

const express = require('express');
const router = express.Router();
const db = require('../db/db');

// POST /simulate
// Body can include: { corridorId, weatherOverride, nuarScenario }
router.post('/simulate', (req, res) => {
  const payload = req.body || {};

  const corridorId = payload.corridorId || null;
  const weatherOverride = payload.weatherOverride || null;
  const nuarScenario = payload.nuarScenario || null;

  // Very simple placeholder logic for now:
  // - Count cases in corridor
  // - Return a basic risk score
  const allCases = db.getAllCases();
  const corridorCases = corridorId
    ? allCases.filter(c => String(c.corridor.id) === String(corridorId))
    : allCases;

  const caseCount = corridorCases.length;

  // crude risk score: base on case count
  const riskScore = Math.min(100, caseCount * 10);

  res.json({
    corridorId,
    caseCount,
    riskScore,
    weatherOverride,
    nuarScenario,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
