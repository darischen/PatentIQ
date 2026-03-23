"use strict";
// Utility to generate structured patent search queries for USPTO API
// Input: array of extracted invention concepts (strings)
// Output: { queries: string[] }
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePatentSearchQueries = generatePatentSearchQueries;
exports.getPatentSearchQueriesJSON = getPatentSearchQueriesJSON;
var SYNONYM_MAP = {
    "drone": ["UAV", "unmanned aerial vehicle"],
    "navigation": ["guidance", "path planning"],
    "obstacle avoidance": ["collision avoidance", "barrier detection"],
    "sensor fusion": ["multi-sensor integration", "data fusion"],
    "aerial mapping": ["surveying", "geospatial mapping"],
    "real-time": ["live", "instantaneous"],
    "mapping": ["surveying", "cartography"],
    "autonomous": ["self-guided", "automatic"],
    // Add more as needed
};
function expandSynonyms(concept) {
    var lower = concept.toLowerCase();
    var expanded = [];
    // Add direct phrase synonyms if present
    if (SYNONYM_MAP[lower]) {
        expanded = expanded.concat(SYNONYM_MAP[lower]);
    }
    // Expand for each word
    var words = lower.split(" ");
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        if (SYNONYM_MAP[word]) {
            expanded = expanded.concat(SYNONYM_MAP[word]);
        }
    }
    // Expand for each two/three-word phrase in the concept
    for (var n = 2; n <= 3; n++) {
        for (var i = 0; i <= words.length - n; i++) {
            var phrase = words.slice(i, i + n).join(" ");
            if (SYNONYM_MAP[phrase]) {
                expanded = expanded.concat(SYNONYM_MAP[phrase]);
            }
        }
    }
    return Array.from(new Set(__spreadArray([concept], expanded, true)));
}
function quoteIfNeeded(term) {
    return /\s/.test(term) ? "\"".concat(term, "\"") : term;
}
function buildGroup(group) {
    // Quote multi-word terms
    return group.map(quoteIfNeeded).join(" OR ");
}
function generatePatentSearchQueries(concepts) {
    // AC1, AC2, AC3: Expand concepts and synonyms
    var expandedConcepts = concepts.map(expandSynonyms);
    var queries = [];
    // AC5: Query Diversity
    // 1. Pairwise AND combinations
    for (var i = 0; i < expandedConcepts.length; i++) {
        for (var j = i + 1; j < expandedConcepts.length; j++) {
            queries.push("(".concat(buildGroup(expandedConcepts[i]), ") AND (").concat(buildGroup(expandedConcepts[j]), ")"));
        }
    }
    // 2. All concepts ANDed together
    queries.push(expandedConcepts.map(function (group) { return "(".concat(buildGroup(group), ")"); }).join(" AND "));
    // 3. Single concept queries
    for (var _i = 0, expandedConcepts_1 = expandedConcepts; _i < expandedConcepts_1.length; _i++) {
        var group = expandedConcepts_1[_i];
        queries.push("(".concat(buildGroup(group), ")"));
    }
    // 4. Feature combinations (triplets)
    if (expandedConcepts.length >= 3) {
        for (var i = 0; i < expandedConcepts.length - 2; i++) {
            queries.push("(".concat(buildGroup(expandedConcepts[i]), ") AND (").concat(buildGroup(expandedConcepts[i + 1]), ") AND (").concat(buildGroup(expandedConcepts[i + 2]), ")"));
        }
    }
    // 5. Alternate phrasing: combine all synonyms for all concepts
    var allSynonyms = Array.from(new Set(expandedConcepts.flat()));
    if (allSynonyms.length > 1) {
        queries.push(allSynonyms.map(quoteIfNeeded).join(" OR "));
    }
    // 6. Pairwise OR combinations for broader recall
    for (var i = 0; i < expandedConcepts.length; i++) {
        for (var j = i + 1; j < expandedConcepts.length; j++) {
            queries.push("(".concat(buildGroup(expandedConcepts[i]), ") OR (").concat(buildGroup(expandedConcepts[j]), ")"));
        }
    }
    // AC4: Boolean Operators (AND, OR, parentheses) are used above
    // AC6: Output Format (JSON)
    // AC7: API Readiness (USPTO API compatible syntax)
    // Limit to 10 queries for API
    return { queries: queries.slice(0, 10) };
}
function getPatentSearchQueriesJSON(concepts) {
    return JSON.stringify(generatePatentSearchQueries(concepts), null, 2);
}

// CLI test harness: run with `node patentQueryGenerator.js`
if (require.main === module) {
    const input = process.argv.slice(2);
    if (input.length === 0) {
        console.log('Usage: node patentQueryGenerator.js <concept1> <concept2> ...');
        process.exit(1);
    }
    const result = getPatentSearchQueriesJSON(input);
    console.log(result);
}
