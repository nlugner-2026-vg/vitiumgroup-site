// backend/db/schema.settings.js
// System‑level settings for VERITAS demo.

function createDefaultSettings() {
  return {
    version: '1.0.0',
    demoMode: true,
    lastRunAt: null,
    weather: {
      // default weather source configuration
      provider: 'offline',
      defaultLocation: null,
    },
    nuar: {
      enabled: true,
      // where NUAR extracts are expected to live (relative to project root)
      mappingPath: 'data/mapping/nuar',
    },
  };
}

module.exports = {
  createDefaultSettings,
};
