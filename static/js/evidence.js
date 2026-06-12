// /static/js/evidence.js

(function () {
  const { getCachedFiles, getCurrentWorkOrderId } = window.VERITAS_INGESTION;

  function initEvidencePage() {
    renderEvidenceList();
  }

  function renderEvidenceList() {
    const container = document.getElementById('evidence-list');
    const woEl = document.getElementById('evidence-wo-id');

    if (!container) {
      console.error('[VERITAS] evidence-list container missing');
      return;
    }

    const wo = getCurrentWorkOrderId() || '-';
    if (woEl) woEl.textContent = wo;

    const files = getCachedFiles();
    container.innerHTML = '';

    if (!Array.isArray(files) || files.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'evidence-empty';
      empty.textContent = 'No evidence files available for the current work order.';
      container.appendChild(empty);
      return;
    }

    files.forEach(file => {
      const row = document.createElement('div');
      row.className = 'evidence-item';
      row.textContent = `${file.filename} [${wo}]`;
      container.appendChild(row);
    });
  }

  window.addEventListener('DOMContentLoaded', initEvidencePage);
})();
