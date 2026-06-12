// /static/js/dashboard_field.js

(function () {
  const { loadWorkSchedule, getCurrentWorkOrderId } = window.VERITAS_INGESTION;
  const { isValidWorkOrderId, normalizeWorkOrderId } = window.VERITAS_WO;

  async function initFieldDashboard() {
    const input = document.getElementById('field-wo-input');
    const button = document.getElementById('field-wo-load');
    const status = document.getElementById('field-status');

    if (!input || !button || !status) {
      console.error('[VERITAS] Field dashboard elements missing');
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
        renderFieldTasks(schedule.tasks || []);
        renderFieldFiles(schedule.files || []);
        status.textContent = `Loaded work order ${wo}`;
        status.className = 'status status-ok';
      } catch (e) {
        console.error('[VERITAS] Failed to load field dashboard:', e);
        status.textContent = 'Failed to load work schedule.';
        status.className = 'status status-error';
      }
    });

    if (input.value && isValidWorkOrderId(input.value)) {
      button.click();
    }
  }

  function renderFieldTasks(tasks) {
    const container = document.getElementById('field-tasks');
    if (!container) return;

    container.innerHTML = '';

    if (!Array.isArray(tasks) || tasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'tasks-empty';
      empty.textContent = 'No tasks for this work order.';
      container.appendChild(empty);
      return;
    }

    tasks.forEach(task => {
      const row = document.createElement('div');
      row.className = 'task-row';
      row.textContent = `${task.code || ''} - ${task.description || ''}`;
      container.appendChild(row);
    });
  }

  function renderFieldFiles(files) {
    const container = document.getElementById('field-files');
    if (!container) return;

    container.innerHTML = '';

    const wo = getCurrentWorkOrderId() || '';

    if (!Array.isArray(files) || files.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'files-empty';
      empty.textContent = 'No files for this work order.';
      container.appendChild(empty);
      return;
    }

    files.forEach(file => {
      if (!file || !file.id) return;
      const row = document.createElement('div');
      row.className = 'file-row';
      row.textContent = `${file.filename} [${wo}]`;
      container.appendChild(row);
    });
  }

  window.addEventListener('DOMContentLoaded', initFieldDashboard);
})();
