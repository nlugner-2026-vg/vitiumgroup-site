// backend/api/evidence.js
// Evidence routes

const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /cases/:id/evidence - list evidence for a case
router.get('/cases/:id/evidence', (req, res) => {
  const caseId = req.params.id;
  const caseObj = db.getCaseById(caseId);
  if (!caseObj) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const items = db.getEvidenceForCase(caseId);
  res.json(items);
});

// POST /cases/:id/evidence - add evidence to a case
router.post('/cases/:id/evidence', (req, res) => {
  const caseId = req.params.id;
  const payload = req.body || {};

  if (!payload.type || !payload.fileName || !payload.filePath) {
    return res.status(400).json({
      error: 'type, fileName, and filePath are required for evidence',
    });
  }

  const created = db.addEvidenceToCase(caseId, {
    type: payload.type,
    fileName: payload.fileName,
    filePath: payload.filePath,
    thumbnailPath: payload.thumbnailPath || null,
    description: payload.description || null,
    capturedAt: payload.capturedAt || new Date().toISOString(),
    capturedBy: payload.capturedBy || null,
    nuarAssetId: payload.nuarAssetId || null,
  });

  if (!created) {
    return res.status(404).json({ error: 'Case not found' });
  }

  res.status(201).json(created);
});

module.exports = router;
