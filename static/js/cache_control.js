// /static/js/cache_control.js

let currentWorkOrderId = null;

/**
 * Reset all work-order-bound caches when a new WO is loaded.
 */
function resetWorkOrderCache(newWorkOrderId) {
  currentWorkOrderId = newWorkOrderId;

  try {
    sessionStorage.removeItem('ingestion_files');
    sessionStorage.removeItem('ingestion_ocr');
    sessionStorage.removeItem('ingestion_dropdowns');
    sessionStorage.removeItem('ingestion_workorders');
    sessionStorage.removeItem('ingestion_evidence');
  } catch (e) {
    console.warn('[VERITAS] sessionStorage not available:', e.message);
  }

  window.__INGESTION_FILES__ = [];
  window.__INGESTION_OCR__ = [];
  window.__INGESTION_DROPDOWNS__ = [];
  window.__INGESTION_EVIDENCE__ = [];

  console.log('[VERITAS] Cache reset for work order:', newWorkOrderId);
}

function getCurrentWorkOrderId() {
  return currentWorkOrderId;
}

window.VERITAS_CACHE = {
  resetWorkOrderCache,
  getCurrentWorkOrderId
};
