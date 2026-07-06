// JavaScript stands for JavaScript

"use strict";

/*
    VERITAS EXPORT MODULE
    Builds the final immutable export object containing:
    - Operator
    - Context
    - Recording events
    - Validation report
    - Enrichment package
    - Hashes (validation, enrichment, export)
    - Deterministic pipeline metadata

    This is the final evidence object produced by VERITAS.
*/

const VeritasExport = (function () {

    /**
     * Build the final export object.
     * @param {object} state - Full VERITAS session state.
     * @param {object} validationReport - Output from VeritasValidators.runFullValidation().
     * @param {object} enrichmentPackage - Output from VeritasEnrichment.buildEnrichmentPackage().
     * @returns {object} Final export object.
     */
    function buildExportObject(state, validationReport, enrichmentPackage) {

        const exportObject = {
            sessionId: state.sessionId,
            timestamp: new Date().toISOString(),

            operator: {
                id: state.operator.id,
                role: state.operator.role
            },

            context: {
                jobId: state.context.jobId,
                assetId: state.context.assetId,
                locationName: state.context.locationName
            },

            recording: {
                isActive: state.recording.isActive,
                events: [...state.recording.events]
            },

            validation: {
                ...validationReport
            },

            enrichment: {
                ...enrichmentPackage
            },

            hashes: {
                validationHash: VeritasHash.hashValidationReport(validationReport),
                enrichmentHash: VeritasHash.hashEnrichmentPackage(enrichmentPackage)
            },

            pipeline: {
                steps: [
                    "Record",
                    "Validate",
                    "Enrich",
                    "Hash",
                    "Export",
                    "Push"
                ],
                status: "Export object built"
            }
        };

        // Add final export hash (hash of the entire object)
        exportObject.hashes.exportHash = VeritasHash.hashExportObject(exportObject);

        return exportObject;
    }

    /* PUBLIC API */
    return {
        buildExportObject
    };

})();
