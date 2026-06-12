/**
 * VERITAS‑1.0‑DEMO
 * File: g2_ingestion.js
 * Purpose: Panasonic G2 ingestion module – enumerates and exposes scan artefacts
 *          from the SCANS directory for use by the VERITAS frontend and other
 *          backend modules.
 *
 * Notes:
 * - This module is designed to be mounted under the route:
 *     /api/g2/ingest
 *   from server.js using:
 *     const g2IngestionRouter = require('./g2_ingestion');
 *     app.use('/api/g2/ingest', g2IngestionRouter);
 *
 * - The module is read‑only and non‑destructive. It does not modify, move,
 *   or delete any files. It only enumerates and describes them.
 *
 * - Supported formats:
 *   - JPEG (Joint Photographic Experts Group) images in SCANS/jpeg
 *   - PNG (Portable Network Graphics) images in SCANS/PNG
 *   - TIFF (Tagged Image File Format) images in SCANS/tiff
 *   - PDF (Portable Document Format) documents in SCANS/pdf
 *   - BMP (Bitmap Image File) images in SCANS/bmp
 *
 * Updated: 2026‑05‑27
 * Updated by: Microsoft Copilot (per Nils’ ground rules)
 */

const express = require('express');  // Web framework for defining application programming interface (API) routes
const fs = require('fs');           // File system module for directory and file operations
const path = require('path');       // Path module for safe cross‑platform path handling

// Create an Express router instance to encapsulate all Panasonic G2 ingestion routes
const router = express.Router();

/**
 * === Configuration: SCANS root directory ===
 *
 * The SCANS directory resides in the root of the VERITAS‑1.0‑DEMO project.
 * This module is located in backend/, so we navigate one level up (..) and
 * then into SCANS.
 *
 * This uses a relative path so that the code remains portable across machines
 * and does not depend on a hard‑coded absolute path.
 */
const SCANS_ROOT = path.join(__dirname, '..', 'SCANS');

/**
 * === Configuration: Supported format definitions ===
 *
 * Each entry describes:
 * - key: short identifier for the format
 * - folder: the subdirectory under SCANS where files of this type are stored
 * - label: a human‑readable description of the format
 * - extensions: the list of file extensions (lower‑case) that are considered valid
 */
const FORMAT_DEFINITIONS = [
  {
    key: 'jpeg',
    folder: 'jpeg',
    label: 'JPEG image (Joint Photographic Experts Group)',
    extensions: ['.jpg', '.jpeg']
  },
  {
    key: 'png',
    folder: 'PNG',
    label: 'PNG image (Portable Network Graphics)',
    extensions: ['.png']
  },
  {
    key: 'tiff',
    folder: 'tiff',
    label: 'TIFF image (Tagged Image File Format)',
    extensions: ['.tif', '.tiff']
  },
  {
    key: 'pdf',
    folder: 'pdf',
    label: 'PDF document (Portable Document Format)',
    extensions: ['.pdf']
  },
  {
    key: 'bmp',
    folder: 'bmp',
    label: 'BMP image (Bitmap Image File)',
    extensions: ['.bmp']
  }
];

/**
 * getSafeFileStats
 * Safely retrieves file statistics for a given absolute file path.
 *
 * This helper wraps fs.statSync in a try/catch block to ensure that a single
 * problematic file (for example, a locked file or a race condition where the
 * file disappears) does not cause the entire ingestion operation to fail.
 *
 * @param {string} absolutePath - Absolute path to the file on disk.
 * @returns {fs.Stats|null} - File statistics object, or null if retrieval fails.
 */
function getSafeFileStats(absolutePath) {
  try {
    return fs.statSync(absolutePath);
  } catch (error) {
    // In a production or audit context, this could be logged to a dedicated log file.
    // For the demo edition, we silently skip problematic files.
    return null;
  }
}

/**
 * enumerateFormatFiles
 * Enumerates all files for a given format definition.
 *
 * This function:
 * - Resolves the absolute path to the format folder under SCANS
 * - Verifies that the folder exists
 * - Reads all entries in the folder
 * - Filters entries by extension
 * - Builds a structured description for each file
 *
 * @param {object} formatDefinition - One entry from FORMAT_DEFINITIONS.
 * @returns {Array<object>} - Array of file descriptor objects for this format.
 */
function enumerateFormatFiles(formatDefinition) {
  const results = [];

  // Resolve the absolute path to the format folder (for example, SCANS/jpeg)
  const formatFolderPath = path.join(SCANS_ROOT, formatDefinition.folder);

  // If the folder does not exist, we return an empty list for this format.
  if (!fs.existsSync(formatFolderPath)) {
    return results;
  }

  // Read all directory entries (files and possibly subdirectories)
  const entries = fs.readdirSync(formatFolderPath, { withFileTypes: true });

  for (const entry of entries) {
    // We only care about regular files, not subdirectories
    if (!entry.isFile()) {
      continue;
    }

    const fileName = entry.name;
    const fileExtension = path.extname(fileName).toLowerCase();

    // Skip files that do not match the allowed extensions for this format
    if (!formatDefinition.extensions.includes(fileExtension)) {
      continue;
    }

    // Build the absolute path to the file
    const absoluteFilePath = path.join(formatFolderPath, fileName);

    // Retrieve file statistics safely
    const stats = getSafeFileStats(absoluteFilePath);
    if (!stats) {
      // If statistics could not be retrieved, skip this file
      continue;
    }

    // Build a deterministic identifier for the file.
    // For the demo edition, we use a combination of format key and file name.
    const fileId = `${formatDefinition.key}:${fileName}`;

    // Build a relative path from the project root for display and logging.
    // This avoids exposing machine‑specific absolute paths to the frontend.
    const relativePathFromRoot = path.join('SCANS', formatDefinition.folder, fileName);

    // Push a structured descriptor for this file into the results array
    results.push({
      id: fileId,                                      // Deterministic identifier for this file
      formatKey: formatDefinition.key,                 // Short key for the format (for example, "jpeg")
      formatLabel: formatDefinition.label,             // Human‑readable description of the format
      fileName: fileName,                              // File name as stored on disk
      extension: fileExtension,                        // File extension in lower‑case
      relativePath: relativePathFromRoot,              // Path relative to the project root
      sizeBytes: stats.size,                           // File size in bytes
      createdAt: stats.birthtime,                      // File creation time (as Date object)
      modifiedAt: stats.mtime                          // Last modification time (as Date object)
    });
  }

  return results;
}

/**
 * buildIngestionSnapshot
 * Builds a complete snapshot of all ingestible files under SCANS.
 *
 * The snapshot is a structured object that:
 * - Confirms the SCANS root directory being used
 * - Lists all supported formats
 * - Provides a flat list of all files across all formats
 *
 * @returns {object} - Snapshot object describing the current ingestible state.
 */
function buildIngestionSnapshot() {
  const allFiles = [];

  // Iterate over each supported format and collect its files
  for (const formatDefinition of FORMAT_DEFINITIONS) {
    const filesForFormat = enumerateFormatFiles(formatDefinition);
    allFiles.push(...filesForFormat);
  }

  // Sort files deterministically by format key and then by file name
  allFiles.sort((a, b) => {
    if (a.formatKey < b.formatKey) return -1;
    if (a.formatKey > b.formatKey) return 1;
    if (a.fileName < b.fileName) return -1;
    if (a.fileName > b.fileName) return 1;
    return 0;
  });

  // Build and return the snapshot object
  return {
    scansRoot: SCANS_ROOT,                 // Absolute path to the SCANS root directory
    supportedFormats: FORMAT_DEFINITIONS.map(def => ({
      key: def.key,
      folder: def.folder,
      label: def.label,
      extensions: def.extensions
    })),                                   // Summary of supported formats
    totalFiles: allFiles.length,           // Total number of ingestible files
    files: allFiles                        // Detailed descriptors for each file
  };
}

/**
 * === Route: GET / (mounted under /api/g2/ingest) ===
 *
 * When this router is mounted at:
 *   /api/g2/ingest
 *
 * This endpoint becomes:
 *   GET /api/g2/ingest
 *
 * Behaviour:
 * - Validates that the SCANS root directory exists.
 * - Builds a snapshot of all ingestible files.
 * - Returns a structured JavaScript Object Notation (JSON) response.
 *
 * This route is intentionally read‑only and side‑effect free.
 */
router.get('/', (request, response) => {
  // Verify that the SCANS root directory exists before proceeding
  if (!fs.existsSync(SCANS_ROOT)) {
    return response.status(500).json({
      success: false,
      message: 'SCANS root directory not found. Expected SCANS folder in project root.',
      scansRoot: SCANS_ROOT
    });
  }

  // Build the ingestion snapshot
  const snapshot = buildIngestionSnapshot();

  // Respond with a success flag and the snapshot payload
  return response.json({
    success: true,
    message: 'Panasonic G2 ingestion snapshot generated successfully.',
    payload: snapshot
  });
});

/**
 * Export the router so that server.js can mount it under /api/g2/ingest.
 */
module.exports = router;
