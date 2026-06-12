// /static/js/wo_utils.js

const WO_PATTERN = /^WO-[A-Za-z0-9]+$/;

/**
 * Validate work order identifier against VERITAS rule:
 * WO-[A-Za-z0-9]+
 */
function isValidWorkOrderId(id) {
  if (!id || typeof id !== 'string') return false;
  return WO_PATTERN.test(id.trim());
}

/**
 * Normalize work order identifier (trim only).
 */
function normalizeWorkOrderId(id) {
  if (!id || typeof id !== 'string') return '';
  return id.trim();
}

// Expose globally for non-module HTML usage
window.VERITAS_WO = {
  isValidWorkOrderId,
  normalizeWorkOrderId
};
