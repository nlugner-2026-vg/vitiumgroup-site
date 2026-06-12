// backend/routes/upload.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const runOCR = require('../utils/ocr');

// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../storage/evidence'));
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${timestamp}-${safeOriginalName}`);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../storage/evidence', req.file.filename);

        // Hash file
        const fileBuffer = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // OCR
        let ocrResult = { text: '', confidence: 0 };
        try {
            ocrResult = await runOCR(filePath);
        } catch (err) {
            console.error('OCR failed:', err);
        }

        // Timestamps
        const now = new Date();
        const timestamp_system = now.toISOString();
        const timestamp_display =
            now.toLocaleString('en-GB', { timeZone: 'Europe/London' }) + ' GMT';

        res.json({
            status: 'ok',
            fileName: req.file.filename,
            hash: hash,
            timestamp_display: timestamp_display,
            timestamp_system: timestamp_system,
            ocrText: ocrResult.text,
            ocrConfidence: ocrResult.confidence
        });
    } catch (err) {
        console.error('Upload route error:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

module.exports = router;

