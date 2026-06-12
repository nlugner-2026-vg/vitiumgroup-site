// /static/js/dashboard_admin.js

(function () {
  const { isValidWorkOrderId, normalizeWorkOrderId } = window.VERITAS_WO;

  async function initAdminDashboard() {
    const input = document.getElementById('admin-wo-input');
    const button = document.getElementById('admin-wo-load');
    const status = document.getElementById('admin-status');

    if (!input || !button || !status) {
      console.error('[VERITAS] Admin dashboard elements missing');
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

      status.textContent = 'Loading admin view...';
      status.className = 'status status-loading';

      try {
        const res = await fetch(`/api/admin/workorder?workorder=${encodeURIComponent(wo)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error('Admin API error');

        const data = await res.json();
        renderAdminWorkOrder(wo, data);
        status.textContent = `Loaded admin view for ${wo}`;
        status.className = 'status status-ok';
      } catch (e) {
        console.error('[VERITAS] Failed to load admin dashboard:', e);
        status.textContent = 'Failed to load admin view.';
        status.className = 'status status-error';
      }
    });
  }

  function renderAdminWorkOrder(wo, data) {
    const woEl = document.getElementById('admin-wo-id');
    const filesContainer = document.getElementById('admin-evidence');
    const eventsContainer = document.getElementById('admin-events');

    if (woEl) woEl.textContent = wo || '-';

    if (filesContainer) {
      filesContainer.innerHTML = '';
      const files = Array.isArray(data.files) ? data.files : [];
      if (files.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'admin-empty';
        empty.textContent = 'No files for this work order.';
        filesContainer.appendChild(empty);
      } else {
        files.forEach(file => {
          const row = document.createElement('div');
          row.className = 'admin-evidence-row';
          row.textContent = `${file.filename} (${file.id})`;
          filesContainer.appendChild(row);
        });
      }
    }

    if (eventsContainer) {
      eventsContainer.innerHTML = '';
      const events = Array.isArray(data.events) ? data.events : [];
      if (events.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'admin-empty';
        empty.textContent = 'No events for this work order.';
        eventsContainer.appendChild(empty);
      } else {
        events.forEach(ev => {
          const row = document.createElement('div');
          row.className = 'admin-event-row';
          row.textContent = `${ev.timestamp || ''} - ${ev.message || ''}`;
          eventsContainer.appendChild(row);
        });
      }
    }
  }

  window.addEventListener('DOMContentLoaded', initAdminDashboard);
})();
