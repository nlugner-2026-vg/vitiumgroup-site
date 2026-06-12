// /static/js/dashboard_office.js

(function () {
  const { loadWorkSchedule, getCachedFiles, getCurrentWorkOrderId } = window.VERITAS_INGESTION;
  const { isValidWorkOrderId, normalizeWorkOrderId } = window.VERITAS_WO;

  async function initOfficeDashboard() {
    const input = document.getElementById('office-wo-input');
    const button = document.getElementById('office-wo-load');
    const status = document.getElementById('office-status');

    if (!input || !button || !status) {
      console.error('[VERITAS] Office dashboard elements missing');
      return;
    }

    button.addEventListener('click', async () => {
      const rawId = input.value;
      const wo = normalizeWorkOrderId(rawId);

      if (!isValidWorkOrderId(wo)) {
        status.textContent = 'Invalid work order identifier. Use format: WO-[A-Za-z0-9]+';
        status.className = 'status status-error';
        return;
      }

      status.textContent = 'Loading work schedule...';
      status.className = 'status status-loading';

      try {
        const schedule = await loadWorkSchedule(wo);
        renderOfficeSummary(schedule);
        renderOfficeEvidence(schedule.files || []);
        status.textContent = `Loaded work order ${wo}`;
        status.className = 'status status-ok';
      } catch (e) {
        console.error('[VERITAS] Failed to load office dashboard:', e);
        status.textContent = 'Failed to load work schedule.';
        status.className = 'status status-error';
      }
    });

    // Optional: auto-load if a default WO is prefilled
    if (input.value && isValidWorkOrderId(input.value)) {
      button.click();
    }
  }

  function renderOfficeSummary(schedule) {
    const wo = getCurrentWorkOrderId();
    const woEl = document.getElementById('office-wo-id');
    const taskCountEl = document.getElementById('office-task-count');

    if (woEl) woEl.textContent = wo || '-';
    if (taskCountEl) taskCountEl.textContent = Array.isArray(schedule.tasks) ? schedule.tasks.length : 0;
  }

  function renderOfficeEvidence(files) {
    const container = document.getElementById('office-evidence');
    if (!container) return;

    container.innerHTML = '';

    const wo = getCurrentWorkOrderId() || '';

    if (!Array.isArray(files) || files.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'evidence-empty';
      empty.textContent = 'No evidence files for this work order.';
      container.appendChild(empty);
      return;
    }

    files.forEach(file => {
      if (!file || !file.id) return;
      const row = document.createElement('div');
      row.className = 'evidence-row';
      row.textContent = `${file.filename} [${wo}]`;
      container.appendChild(row);
    });
  }

  window.addEventListener('DOMContentLoaded', initOfficeDashboard);
})();
