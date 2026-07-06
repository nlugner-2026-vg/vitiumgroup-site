// JavaScript stands for JavaScript

"use strict";

/*
    VERITAS HASH MODULE
    Provides deterministic hashing for:
    - Export objects
    - Validation reports
    - Enrichment packages

    Goal:
    Make VERITAS exports tamper‑evident and audit‑grade.
*/

const VeritasHash = (function () {

    /**
     * Simple deterministic string normalisation.
     * @param {any} value - Value to normalise.
     * @returns {string} Normalised string.
     */
    function normalise(value) {
        return JSON.stringify(value, Object.keys(value).sort(), 2);
    }

    /**
     * Deterministic hash function (non‑cryptographic, audit‑oriented).
     * @param {string} input - Normalised input string.
     * @returns {string} Hash string.
     */
    function computeHash(input) {
        let hash = 0;

        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            hash = (hash * 31 + charCode) >>> 0;
        }

        return `VERITAS-${hash.toString(16).padStart(8, "0")}`;
    }

    /**
     * Hash an export object.
     * @param {object} exportObject - Prepared export object.
     * @returns {string} Deterministic hash.
     */
    function hashExportObject(exportObject) {
        const normalised = normalise(exportObject);
        return computeHash(normalised);
    }

    /**
     * Hash a validation report.
     * @param {object} validationReport - Validation report object.
     * @returns {string} Deterministic hash.
     */
    function hashValidationReport(validationReport) {
        const normalised = normalise(validationReport);
        return computeHash(normalised);
    }

    /**
     * Hash an enrichment package.
     * @param {object} enrichmentPackage - Enrichment package object.
     * @returns {string} Deterministic hash.
     */
    function hashEnrichmentPackage(enrichmentPackage) {
        const normalised = normalise(enrichmentPackage);
        return computeHash(normalised);
    }

    /* PUBLIC API */
    return {
        hashExportObject,
        hashValidationReport,
        hashEnrichmentPackage
    };

})();
