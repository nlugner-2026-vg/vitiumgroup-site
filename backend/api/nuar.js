// backend/api/nuar.js
// NUAR asset routes (offline-capable)

const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /nuar/assets - list all NUAR assets
router.get('/nuar/assets', (req, res) => {
  const assets = db.getAllNuarAssets();
  res.json(assets);
});

// GET /nuar/corridors/:corridorId/assets - NUAR assets for a corridor
router.get('/nuar/corridors/:corridorId/assets', (req, res) => {
  const corridorId = req.params.corridorId;
  const assets = db.getNuarAssetsForCorridor(corridorId);
  res.json(assets);
});

// POST /nuar/assets - add a NUAR asset (for demo seeding/import)
router.post('/nuar/assets', (req, res) => {
  const payload = req.body || {};

  if (!payload.externalId || !payload.type || !payload.operator) {
    return res.status(400).json({
      error: 'externalId, type, and operator are required for NUAR asset',
    });
  }

  const asset = db.addNuarAsset({
    externalId: payload.externalId,
    type: payload.type,
    operator: payload.operator,
    geometry: payload.geometry || null,
    corridorId: payload.corridorId || null,
    attributes: payload.attributes || {},
  });

  res.status(201).json(asset);
});

module.exports = router;
