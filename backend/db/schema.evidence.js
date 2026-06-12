// backend/db/schema.evidence.js
// Evidence schema, linked to cases and NUAR assets where relevant.

function createEvidence({
  id,
  caseId,
  type,          // 'photo', 'document', 'sensor', etc.
  fileName,
  filePath,
  thumbnailPath = null,
  description = null,
  capturedAt = new Date().toISOString(),
  capturedBy = null, // { id, name }
  nuarAssetId = null,
} = {}) {
  return {
    id,
    caseId,
    type,
    fileName,
    filePath,
    thumbnailPath,
    description,
    capturedAt,
    capturedBy: capturedBy || {
      id: null,
      name: null,
    },
    nuarAssetId, // optional link to NUAR asset
  };
}

module.exports = {
  createEvidence,
};
