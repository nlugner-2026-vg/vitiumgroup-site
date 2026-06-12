// office.js — VERITAS OFFICE handshake logic
// Doctrine: Immutable truth from the field

// Demo dataset for testing
const reports = [
  { id: 1, title: "Lane A3 – Burst main", lane: "Northbound A3", details: "Verify repair completion and telemetry sync." },
  { id: 2, title: "Valve check – Reservoir Road", lane: "Southbound B2", details: "Confirm valve exercise record and pressure stability." },
  { id: 3, title: "Low pressure – Oakfield Estate", lane: "Eastbound C1", details: "Review PRV adjustment and confirm field notes." }
];

const reportList = document.getElementById("reportList");
const reportDetails = document.getElementById("reportDetails");
const officeNotes = document.getElementById("officeNotes");
const btnFlag = document.getElementById("btnFlag");
const btnApprove = document.getElementById("btnApprove");
const refreshReports = document.getElementById("refreshReports");

let activeReport = null;

// Render reports
function renderReports() {
  reportList.innerHTML = "";
  reports.forEach(report => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.dataset.id = report.id;
    div.innerHTML = `
      <div class="list-title">${report.title}</div>
      <div class="list-meta">Lane: ${report.lane}</div>
    `;
    div.onclick = () => selectReport(report, div);
    reportList.appendChild(div);
  });
}

// Select report
function selectReport(report, element) {
  activeReport = report;
  document.querySelectorAll(".list-item").forEach(i => i.classList.remove("active"));
  element.classList.add("active");
  reportDetails.textContent = report.details;
}

// Button actions
btnFlag.onclick = () => {
  if (!activeReport) {
    alert("Select a report first.");
    return;
  }
  console.log("FLAGGED:", activeReport.title);
  alert(`Report flagged: ${activeReport.title}`);
};

btnApprove.onclick = () => {
  if (!activeReport) {
    alert("Select a report first.");
    return;
  }
  console.log("APPROVED:", activeReport.title);
  alert(`Report approved: ${activeReport.title}`);
};

// Refresh
refreshReports.onclick = () => {
  console.log("Refreshing reports...");
  renderReports();
};

// Initialise
renderReports();
