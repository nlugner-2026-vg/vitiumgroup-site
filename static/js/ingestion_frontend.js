// /static/js/ingestion_frontend.js

(function () {
  const { isValidWorkOrderId, normalizeWorkOrderId } = window.VERITAS_WO;
  const { resetWorkOrderCache, getCurrentWorkOrderId } = window.VERITAS_CACHE;

  /**
   * Load work schedule and ingestion data for a given work order.
   * Enforces:
   *  - WO validation
   *  - cache reset
   *  - HIDE FIRST (filter files by active WO)
   */
  async function loadWorkSchedule(workOrderId) {
    const wo = normalizeWorkOrderId(workOrderId);

    if (!isValidWorkOrderId(wo)) {
      console.error('[VERITAS] Invalid work order id:', wo);
      throw new Error('Invalid work order identifier (expected WO-[A-Za-z0-9]+)');
    }

    resetWorkOrderCache(wo);

    const res = await fetch(`/api/work-schedule?workorder=${encodeURIComponent(wo)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error('Failed to load work schedule');
    }

    const data = await res.json();
    const files = Array.isArray(data.files) ? data.files : [];

    const safeFiles = files.filter(f => {
      const fileWo = normalizeWorkOrderId(f.workorder || f.work_order || '');
      return fileWo === wo;
    });

    window.__INGESTION_FILES__ = safeFiles;
    try {
      sessionStorage.setItem('ingestion_files', JSON.stringify(safeFiles));
    } catch (e) {
      console.warn('[VERITAS] Unable to persist ingestion_files:', e.message);
    }

    return {
      ...data,
      workorder: wo,
      files: safeFiles
    };
  }

  function getCachedFiles() {
    if (Array.isArray(window.__INGESTION_FILES__)) {
      return window.__INGESTION_FILES__;
    }
    try {
      const raw = sessionStorage.getItem('ingestion_files');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.warn('[VERITAS] Failed to read cached files:', e.message);
    }
    return [];
  }

  window.VERITAS_INGESTION = {
    loadWorkSchedule,
    getCachedFiles,
    getCurrentWorkOrderId
  };
})();
