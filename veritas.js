// veritas.js
// VERITAS PIN login logic – immutable rules for 1937 and 9876,
// all other operators managed via Admin Dashboard.

(function () {
  "use strict";

  // Immutable Master Admin PIN (yours) – cannot be edited, deleted, or overridden.
  const MASTER_ADMIN_PIN = "1937";

  // Panasonic Master Engineer PIN – test version, must access Admin Dashboard, subordinate to MASTER_ADMIN_PIN.
  const PANASONIC_MASTER_PIN = "9876";

  // Target Admin Dashboard file – confirmed as dashboard_admin.html.
  const ADMIN_DASHBOARD_URL = "dashboard_admin.html";

  function handleLoginSubmit(event) {
    event.preventDefault();

    const pinInput = document.getElementById("veritasPinInput");
    const messageEl = document.getElementById("veritasLoginMessage");

    if (!pinInput || !messageEl) {
      return;
    }

    const pin = (pinInput.value || "").trim();

    // Empty PIN – simple guard.
    if (pin.length === 0) {
      messageEl.textContent = "Enter your VERITAS PIN.";
      return;
    }

    // Highest priority: Master Admin PIN (1937).
    if (pin === MASTER_ADMIN_PIN) {
      messageEl.textContent = "";
      window.location.href = ADMIN_DASHBOARD_URL;
      return;
    }

    // Secondary priority: Panasonic Master PIN (9876).
    if (pin === PANASONIC_MASTER_PIN) {
      messageEl.textContent = "";
      window.location.href = ADMIN_DASHBOARD_URL;
      return;
    }

    // All other operator PINs are created and managed inside the Admin Dashboard
    // by you or an organisation’s administrator. They are not hard-coded here.
    messageEl.textContent = "PIN not recognised. Contact your administrator.";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("veritasLoginForm");
    if (form) {
      form.addEventListener("submit", handleLoginSubmit);
    }
  });
})();

