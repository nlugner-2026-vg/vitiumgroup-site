// backend/db/schema.cases.js
// Case schema (including NUAR + weather + corridor metadata).

function createCase({
  id,
  urn,
  title,
  description,
  status = 'open',
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
  corridorId = null,
  corridorName = null,
  location = null, // e.g. { lat, lon }
  weather = null,  // e.g. { condition, temperature, source, observedAt }
  operator = null, // e.g. { id, name, organisation }
  nuar = null,     // NUAR metadata block
} = {}) {
  return {
    id,
    urn,
    title,
    description,
    status,
    createdAt,
    updatedAt,
    corridor: {
      id: corridorId,
      name: corridorName,
      location,
    },
    weather: weather || {
      condition: null,
      temperature: null,
      source: null,
      observedAt: null,
    },
    operator: operator || {
      id: null,
      name: null,
      organisation: null,
    },
    nuar: nuar || {
      // NUAR‑capable from day one
      assets: [], // array of NUAR asset references (see schema.nuar.js)
      corridorRef: null,
      nuarDatasetVersion: null,
      notes: null,
    },
  };
}

module.exports = {
  createCase,
};
