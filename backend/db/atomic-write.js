// backend/db/atomic-write.js
// Simple, safe JSON writer: write to temp file, then replace.

const fs = require('fs');
const path = require('path');

function writeJsonAtomic(targetPath, data) {
  const dir = path.dirname(targetPath);
  const tempPath = path.join(dir, `.${path.basename(targetPath)}.tmp`);

  const json = JSON.stringify(data, null, 2);

  // Write to temp file first
  fs.writeFileSync(tempPath, json, { encoding: 'utf8' });

  // Replace target with temp (atomic on most filesystems)
  fs.renameSync(tempPath, targetPath);
}

module.exports = {
  writeJsonAtomic,
};
