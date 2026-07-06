// JavaScript stands for JavaScript

"use strict";

/*
    VERITAS VALIDATORS MODULE
    This module performs deterministic validation of:
    - Operator identity
    - Context completeness
    - Event sequence integrity
    - Recording lifecycle correctness
    - Enrichment completeness
    - Export readiness

    Fully audit‑ready, no placeholders, no assumptions.
*/

/* VALIDATION STATE */
const VeritasValidators = (function () {

    /**
     * Validate operator identity fields.
     * @param {object} operator - Operator object containing id and role.
     * @returns {object} Validation result.
     */
    function validateOperator(operator) {
        const errors = [];

        if (!operator.id || operator.id.trim().length === 0) {
            errors.push("Operator Identifier is missing.");
        }

        if (!operator.role || operator.role.trim().length === 0) {
            errors.push("Operator Role is missing.");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate job and asset context fields.
     * @param {object} context - Context object containing jobId, assetId, locationName.
     * @returns {object} Validation result.
     */
    function validateContext(context) {
        const errors = [];

        if (!context.jobId || context.jobId.trim().length === 0) {
            errors.push("Job Identifier is missing.");
        }

        if (!context.assetId || context.assetId.trim().length === 0) {
            errors.push("Asset Identifier is missing.");
        }

        if (!context.locationName || context.locationName.trim().length === 0) {
            errors.push("Location Name is missing.");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate recorded event sequence.
     * @param {array} events - Array of recorded events.
     * @returns {object} Validation result.
     */
    function validateEventSequence(events) {
        const errors = [];

        if (!Array.isArray(events) || events.length === 0) {
            errors.push("No recorded events found.");
            return { valid: false, errors };
        }

        let previousTimestamp = null;

        events.forEach((event, index) => {
            if (!event.timestamp || !event.description) {
                errors.push(`Event ${index + 1} is missing required fields.`);
            }

            const currentTimestamp = Date.parse(event.timestamp);

            if (isNaN(currentTimestamp)) {
                errors.push(`Event ${index + 1} has