// console.js — VERITAS Corridor Console Logic

const API_BASE = "http://localhost:4000";

// --- HEALTH CHECK -----------------------------------------------------------
async function checkHealth() {
  const box = document.getElementById("health");

  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    box.textContent = `Status: ${data.status.toUpperCase()} | Service: ${data.service}`;
    box.style.color = "green";
  } catch {
    box.textContent = "Backend unreachable";
    box.style.color = "red";
  }
}

// --- MODULE CHECK -----------------------------------------------------------
async function loadModules() {
  const modules = [
    { name: "Cases", route: "/cases" },
    { name: "Evidence", route: "/evidence" },
    { name: "NUAR", route: "/nuar" },
    { name: "Simulation", route: "/simulation" }
  ];

  const list = document.getElementById("module-list");
  list.innerHTML = "";

  for (const mod of modules) {
    const li = document.createElement("li");
    li.textContent = `${mod.name}: checking...`;
    list.appendChild(li);

    try {
      const res = await fetch(`${API_BASE}${mod.route}`);
      if (res.ok) {
        li.textContent = `${mod.name}: READY`;
        li.style.color = "green";
      } else {
        li.textContent = `${mod.name}: UNAVAILABLE`;
        li.style.color = "red";
      }
    } catch {
      li.textContent = `${mod.name}: UNREACHABLE`;
      li.style.color = "orange";
    }
  }
}

// --- INIT -------------------------------------------------------------------
checkHealth();
loadModules();
