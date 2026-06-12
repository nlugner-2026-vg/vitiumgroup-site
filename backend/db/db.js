// backend/db/db.js
// TinySQL‑style JSON datastore for VERITAS‑1.0‑DEMO.
// Uses simple JSON files under data/veritas-db/ with atomic writes.

const fs = require('fs');
const path = require('path');
const { writeJsonAtomic } = require('./atomic-write');
const { createCase } = require('./schema.cases');
const { createEvidence } = require('./schema.evidence');
const { createDefaultSettings } = require('./schema.settings');
const { createNuarAsset } = require('./schema.nuar');

// Resolve data directory relative to this file
const DATA_DIR = path.resolve(__dirname, '../../data/veritas-db');

const CASES_FILE = path.join(DATA_DIR, 'cases.json');
const EVIDENCE_FILE = path.join(DATA_DIR, 'evidence.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const NUAR_FILE = path.join(DATA_DIR, 'nuar-assets.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// --- helpers -------------------------------------------------------------

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  const raw = fs.readFileSync(filePath, { encoding: 'utf8' });
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJson(filePath, data) {
  writeJsonAtomic(filePath, data);
}

// --- initialisation ------------------------------------------------------

function initCases() {
  const data = loadJson(CASES_FILE, []);
  saveJson(CASES_FILE, data);
  return data;
}

function initEvidence() {
  const data = loadJson(EVIDENCE_FILE, []);
  saveJson(EVIDENCE_FILE, data);
  return data;
}

function initSettings() {
  const data = loadJson(SETTINGS_FILE, null);
  if (!data) {
    const defaults = createDefaultSettings();
    saveJson(SETTINGS_FILE, defaults);
    return defaults;
  }
  return data;
}

function initNuarAssets() {
  const data = loadJson(NUAR_FILE, []);
  saveJson(NUAR_FILE, data);
  return data;
}

// Initialise on first load
let cases = initCases();
let evidence = initEvidence();
let settings = initSettings();
let nuarAssets = initNuarAssets();

// --- ID helpers ----------------------------------------------------------

function nextId(collection) {
  if (!collection.length) return 1;
  const max = collection.reduce((m, item) => (item.id > m ? item.id : m), 0);
  return max + 1;
}

// --- CASES ---------------------------------------------------------------

function getAllCases() {
  return cases;
}

function getCaseById(id) {
  return cases.find(c => String(c.id) === String(id)) || null;
}

function createNewCase(payload) {
  const id = nextId(cases);
  const now = new Date().toISOString();

  const newCase = createCase({
    ...payload,
    id,
    createdAt: now,
    updatedAt: now,
  });

  cases.push(newCase);
  saveJson(CASES_FILE, cases);
  return newCase;
}

function updateCase(id, updates) {
  const idx = cases.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const updated = {
    ...cases[idx],
    ...updates,
    updatedAt: now,
  };

  cases[idx] = updated;
  saveJson(CASES_FILE, cases);
  return updated;
}

function reopenCase(id) {
  return updateCase(id, { status: 'reopened' });
}

// --- EVIDENCE ------------------------------------------------------------

function getEvidenceForCase(caseId) {
  return evidence.filter(e => String(e.caseId) === String(caseId));
}

function addEvidenceToCase(caseId, payload) {
  const caseObj = getCaseById(caseId);
  if (!caseObj) {
    return null;
  }

  const id = nextId(evidence);
  const newEvidence = createEvidence({
    ...payload,
    id,
    caseId: caseObj.id,
  });

  evidence.push(newEvidence);
  saveJson(EVIDENCE_FILE, evidence);
  return newEvidence;
}

// --- SETTINGS ------------------------------------------------------------

function getSettings() {
  return settings;
}

function updateSettings(updates) {
  settings = {
    ...settings,
    ...updates,
  };
  saveJson(SETTINGS_FILE, settings);
  return settings;
}

// --- NUAR ASSETS ---------------------------------------------------------

function getAllNuarAssets() {
  return nuarAssets;
}

function getNuarAssetsForCorridor(corridorId) {
  return nuarAssets.filter(a => String(a.corridorId) === String(corridorId));
}

function addNuarAsset(payload) {
  const id = nextId(nuarAssets);
  const asset = createNuarAsset({
    ...payload,
    id,
  });
  nuarAssets.push(asset);
  saveJson(NUAR_FILE, nuarAssets);
  return asset;
}

// --- EXPORTS -------------------------------------------------------------

module.exports = {
  // cases
  getAllCases,
  getCaseById,
  createNewCase,
  updateCase,
  reopenCase,

  // evidence
  getEvidenceForCase,
  addEvidenceToCase,

  // settings
  getSettings,
  updateSettings,

  // NUAR
  getAllNuarAssets,
  getNuarAssetsForCorridor,
  addNuarAsset,
};
