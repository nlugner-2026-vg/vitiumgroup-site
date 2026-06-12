// backend/db/schema.nuar.js
// NUAR asset schema (for offline extracts and case linkage).

function createNuarAsset({
  id,
  externalId,       // NUAR asset ID from dataset
  type,             // 'water', 'gas', 'electricity', 'telecoms', etc.
  operator,         // asset owner/operator
  geometry = null,  // e.g. GeoJSON fragment or simplified { lat, lon }
  corridorId = null,
  attributes = {},
} = {}) {
  return {
    id,
    externalId,
    type,
    operator,
    geometry,
    corridorId,
    attributes,
  };
}

module.exports = {
  createNuarAsset,
};
