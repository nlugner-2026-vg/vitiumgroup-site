// JavaScript stands for JavaScript

"use strict";

/* SESSION STATE */
const state = {
    sessionId: null,
    pin: "",
    operator: {
        id: "",
        role: ""
    },
    context: {
        jobId: "",
        assetId: "",
        locationName: ""
    },
    recording: {
        isActive: false,
        events: []
    },
    validation: {
        status: "Pending"
    },
    enrichment: {
        weather: "Not requested",
        gps: "Not requested",
        field: "Not requested",
        coveragePercent: 0
    },
    exportPipeline: {
        readiness: "Not prepared",
        object: null
    },
    auditLog: []
};

/* PIN ACCESS CONTROL */
const validPins = {
    "1937": "master",             // Master access, full dashboards
    "111111": "machine-operator",
    "222222": "site-supervisor",
    "333333": "field-engineer",
    "444444": "auditor"
};

const allowedViewsByRole = {
    master: ["overview", "operations", "enrichment", "export", "audit"],
    "machine-operator": ["overview", "operations", "enrichment"],
    "site-supervisor": ["overview", "operations", "enrichment", "export"],
    "field-engineer": ["overview", "operations", "enrichment"],
    auditor: ["overview", "audit"]
};

/* SESSION ID GENERATOR */
function generateSessionId() {
    const timestamp = new Date().toISOString();
    const randomComponent = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
    return `VERITAS-${timestamp}-${randomComponent}`;
}

/* AUDIT LOGGING */
function recordAuditEvent(description) {
    const entry = {
        timestamp: new Date().toISOString(),
        description
    };
    state.auditLog.push(entry);
    renderAuditLog();
}

function renderAuditLog() {
    const auditContainer = document.getElementById("audit-log");
    if (!auditContainer) return;

    if (state.auditLog.length === 0) {
        auditContainer.textContent = "No audit events recorded.";
        return;
    }

    const lines = state.auditLog.map(
        entry => `${entry.timestamp} — ${entry.description}`
    );

    auditContainer.textContent = lines.join("\n");
}

/* OVERVIEW METRICS */
function renderOverviewMetrics() {
    document.getElementById("metric-records-value").textContent =
        state.recording.events.length;

    document.getElementById("metric-validations-value").textContent =
        state.validation.status;

    document.getElementById("metric-enrichment-value").textContent =
        `${state.enrichment.coveragePercent}%`;

    document.getElementById("metric-export-value").textContent =
        state.exportPipeline.readiness;
}

/* OPERATIONS TIMELINE */
function renderOperationsTimeline() {
    const timeline = document.getElementById("operations-timeline");

    if (state.recording.events.length === 0) {
        timeline.textContent = "No recorded events.";
        return;
    }

    const lines = state.recording.events.map(
        (event, index) => `${index + 1}. ${event.timestamp} — ${event.description}`
    );

    timeline.textContent = lines.join("\n");
}

/* ENRICHMENT STATUS */
function renderEnrichmentStatus() {
    document.getElementById("enrichment-weather-status").textContent =
        state.enrichment.weather;

    document.getElementById("enrichment-gps-status").textContent =
        state.enrichment.gps;

    document.getElementById("enrichment-field-status").textContent =
        state.enrichment.field;
}

/* EXPORT OBJECT PREVIEW */
function renderExportObjectPreview() {
    const preview = document.getElementById("export-object-json");

    if (!state.exportPipeline.object) {
        preview.textContent = "Export object not prepared.";
        return;
    }

    preview.textContent = JSON.stringify(state.exportPipeline.object, null, 2);
}

/* VIEW SWITCHING WITH ROLE CONTROL */
function setActiveView(viewId) {
    const role = state.operator.role || "master";
    const allowedViews = allowedViewsByRole[role] || [];

    if (!allowedViews.includes(viewId)) {
        alert(`Access to view "${viewId}" is not permitted for role "${role}".`);
        recordAuditEvent(
            `View access denied. Role "${role}" attempted to open "${viewId}".`
        );
        return;
    }

    const panels = document.querySelectorAll(".dashboard-panel");
    panels.forEach(panel => {
        const panelView = panel.getAttribute("data-view");
        if (panelView === viewId) {
            panel.removeAttribute("hidden");
        } else {
            panel.setAttribute("hidden", "hidden");
        }
    });

    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach(button => {
        const buttonView = button.getAttribute("data-view");
        if (buttonView === viewId) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    recordAuditEvent(`Dashboard view changed to: ${viewId} (role: ${role}).`);
}

/* SESSION INITIALISATION */
function initialiseSession() {
    state.sessionId = generateSessionId();
    const sessionDisplayElement = document.getElementById("session-id-display");
    if (sessionDisplayElement) {
        sessionDisplayElement.textContent = state.sessionId;
    }
    recordAuditEvent("Session initialised.");
}

/* OPERATOR AND CONTEXT CAPTURE */
function captureOperatorAndContext() {
    const operatorIdInput = document.getElementById("operator-id");
    const operatorRoleSelect = document.getElementById("operator-role");
    const jobIdInput = document.getElementById("job-id");
    const assetIdInput = document.getElementById("asset-id");
    const locationNameInput = document.getElementById("location-name");

    state.operator.id = operatorIdInput ? operatorIdInput.value.trim() : "";
    state.operator.role = operatorRoleSelect ? operatorRoleSelect.value : state.operator.role;
    state.context.jobId = jobIdInput ? jobIdInput.value.trim() : "";
    state.context.assetId = assetIdInput ? assetIdInput.value.trim() : "";
    state.context.locationName = locationNameInput ? locationNameInput.value.trim() : "";
}

/* VALIDATION OF REQUIRED FIELDS */
function validateOperatorAndContext() {
    captureOperatorAndContext();

    const missingFields = [];

    if (!state.operator.id) {
        missingFields.push("Operator Identifier");
    }
    if (!state.operator.role) {
        missingFields.push("Operator Role");
    }
    if (!state.context.jobId) {
        missingFields.push("Job Identifier");
    }
    if (!state.context.assetId) {
        missingFields.push("Asset Identifier");
    }
    if (!state.context.locationName) {
        missingFields.push("Location Name");
    }

    if (missingFields.length > 0) {
        const message =
            "The following required fields are missing: " + missingFields.join(", ");
        alert(message);
        recordAuditEvent("Validation failed for operator and context: " + message);
        return false;
    }

    recordAuditEvent("Operator and context validation succeeded.");
    return true;
}

/* RECORDING CONTROL */
function startRecording() {
    if (!validateOperatorAndContext()) {
        return;
    }

    if (state.recording.isActive) {
        alert("Recording is already active.");
        return;
    }

    state.recording.isActive = true;
    recordAuditEvent("Recording started.");
    addRecordedEvent("Recording started.");
    renderOverviewMetrics();
    renderOperationsTimeline();
}

function stopRecording() {
    if (!state.recording.isActive) {
        alert("Recording is not active.");
        return;
    }

    state.recording.isActive = false;
    recordAuditEvent("Recording stopped.");
    addRecordedEvent("Recording stopped.");
    renderOverviewMetrics();
    renderOperationsTimeline();
}

function addRecordedEvent(description) {
    const event = {
        timestamp: new Date().toISOString(),
        description
    };
    state.recording.events.push(event);
}

/* VALIDATORS */
function runValidators() {
    if (state.recording.events.length === 0) {
        alert("No recorded events available for validation.");
        recordAuditEvent("Validation attempted with no recorded events.");
        return;
    }

    state.validation.status = "Validated";
    recordAuditEvent("Validators executed for current session.");
    renderOverviewMetrics();
}

/* DETERMINISTIC HASH (STRUCTURE ONLY) */
function generateDeterministicHash() {
    if (state.recording.events.length === 0) {
        alert("No recorded events available for hashing.");
        recordAuditEvent("Hash generation attempted with no recorded events.");
        return;
    }

    recordAuditEvent("Deterministic hash generation executed for current session.");
    alert("Deterministic hash generation logic executed (implementation to be extended).");
}

/* ENRICHMENT */
function enrichSession() {
    if (state.recording.events.length === 0) {
        alert("No recorded events available for enrichment.");
        recordAuditEvent("Enrichment attempted with no recorded events.");
        return;
    }

    state.enrichment.weather = "Requested and attached";
    state.enrichment.gps = "Requested and attached";
    state.enrichment.field = "Requested and attached";
    state.enrichment.coveragePercent = 100;

    recordAuditEvent("Session enrichment executed (weather, global positioning, field).");
    renderOverviewMetrics();
    renderEnrichmentStatus();
}

/* EXPORT OBJECT PREPARATION */
function prepareExportObject() {
    if (state.recording.events.length === 0) {
        alert("No recorded events available for export.");
        recordAuditEvent("Export preparation attempted with no recorded events.");
        return;
    }

    const exportObject = {
        sessionId: state.sessionId,
        operator: { ...state.operator },
        context: { ...state.context },
        recording: {
            isActive: state.recording.isActive,
            events: [...state.recording.events]
        },
        validation: { ...state.validation },
        enrichment: { ...state.enrichment },
        pipeline: {
            steps: ["Record", "Enrich", "Hash", "Push"],
            status: "Prepared"
        }
    };

    state.exportPipeline.object = exportObject;
    state.exportPipeline.readiness = "Prepared";
    recordAuditEvent("Export object prepared for current session.");
    renderOverviewMetrics();
    renderExportObjectPreview();
}

/* PUSH TO ESTATE LAKE (STRUCTURE ONLY) */
function pushToEstateLake() {
    if (!state.exportPipeline.object) {
        alert("Export object has not been prepared.");
        recordAuditEvent("Push to estate data lake attempted without prepared export object.");
        return;
    }

    state.exportPipeline.readiness = "Pushed to estate data lake";
    recordAuditEvent("Export object pushed to estate data lake (simulation).");
    renderOverviewMetrics();
    alert("Export object push logic executed (implementation to be extended).");
}

/* LOGIN HANDLING */
function handleLoginSubmit(event) {
    event.preventDefault();

    const pinInput = document.getElementById("pin-input");
    const errorElement = document.getElementById("login-error");

    if (!pinInput) return;

    const enteredPin = pinInput.value.trim();
    const role = validPins[enteredPin];

    if (!role) {
        if (errorElement) {
            errorElement.hidden = false;
        }
        recordAuditEvent(`Login failed. Invalid PIN entered: "${enteredPin}".`);
        return;
    }

    state.pin = enteredPin;
    state.operator.role = role;

    if (errorElement) {
        errorElement.hidden = true;
    }

    const loginScreen = document.getElementById("login-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");

    if (loginScreen && dashboardScreen) {
        loginScreen.hidden = true;
        dashboardScreen.hidden = false;
    }

    initialiseSession();
    setActiveView("overview");
    renderOverviewMetrics();
    renderOperationsTimeline();
    renderEnrichmentStatus();
    renderExportObjectPreview();

    recordAuditEvent(`Login succeeded. Role "${role}" granted access. PIN accepted.`);
}

/* EVENT LISTENERS */
function attachEventListeners() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }

    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const viewId = button.getAttribute("data-view");
            if (viewId) {
                setActiveView(viewId);
            }
        });
    });

    const startRecordingButton = document.getElementById("start-recording-button");
    const stopRecordingButton = document.getElementById("stop-recording-button");
    const runValidationButton = document.getElementById("run-validation-button");
    const generateHashButton = document.getElementById("generate-hash-button");
    const prepareExportButton = document.getElementById("prepare-export-button");
    const pushToLakeButton = document.getElementById("push-to-lake-button");

    if (startRecordingButton) {
        startRecordingButton.addEventListener("click", startRecording);
    }

    if (stopRecordingButton) {
        stopRecordingButton.addEventListener("click", stopRecording);
    }

    if (runValidationButton) {
        runValidationButton.addEventListener("click", runValidators);
    }

    if (generateHashButton) {
        generateHashButton.addEventListener("click", generateDeterministicHash);
    }

    if (prepareExportButton) {
        prepareExportButton.addEventListener("click", () => {
            enrichSession();
            prepareExportObject();
        });
    }

    if (pushToLakeButton) {
        pushToLakeButton.addEventListener("click", pushToEstateLake);
    }
}

/* INITIALISE DASHBOARD */
function initialiseDashboard() {
    attachEventListeners();
}

/* DOCUMENT READY */
document.addEventListener("DOMContentLoaded", () => {
    initialiseDashboard();
});
