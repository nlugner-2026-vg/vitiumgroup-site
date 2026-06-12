const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        version: "VERITAS 1.0",
        metadata_fields: {
            timestamp_display: "Local UK Time (GMT)",
            timestamp_system: "Internal UTC",
            hash: "SHA-256",
            fileName: "Stored filename",
            fileSize: "Bytes",
            fileType: "MIME type",
            gpsLat: "Latitude (optional v1.0)",
            gpsLon: "Longitude (optional v1.0)",
            gpsAccuracy: "Accuracy in metres",
            ocrText: "Extracted text (if OCR enabled)",
            ocrConfidence: "0–1",
            satTileId: "SAT tile reference (optional v1.0)"
        }
    });
});

module.exports = router;
