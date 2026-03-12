import { getRecommendations, RECOMMENDATION_THRESHOLDS } from './lib/recommendation';

async function runRecommendationTest() {
    console.log("========== REC ENGINE TEST ==========");

    // A mock query
    const testQuery = "AI based text summarization and content generation";

    console.log(`Query: "${testQuery}"\n`);

    try {
        console.log(`Fetching HIGH MATCH (>= ${RECOMMENDATION_THRESHOLDS.HIGH_MATCH}) recommendations...`);
        const highMatchRecs = await getRecommendations(testQuery, RECOMMENDATION_THRESHOLDS.HIGH_MATCH);

        console.log(`Found ${highMatchRecs.length} high match patents.`);
        highMatchRecs.forEach((rec, idx) => {
            console.log(` ${idx + 1}. [${rec.match_level}] Score: ${rec.similarity_score.toFixed(3)} - ${rec.title}`);
        });

        console.log(`\nFetching MEDIUM MATCH (>= ${RECOMMENDATION_THRESHOLDS.MEDIUM_MATCH}) recommendations...`);
        const mediumMatchRecs = await getRecommendations(testQuery, RECOMMENDATION_THRESHOLDS.MEDIUM_MATCH);

        console.log(`Found ${mediumMatchRecs.length} medium+ match patents.`);
        mediumMatchRecs.forEach((rec, idx) => {
            console.log(` ${idx + 1}. [${rec.match_level}] Score: ${rec.similarity_score.toFixed(3)} - ${rec.title}`);
        });

        console.log("\nSUCCESS: Recommendation thresholds logic executed safely.");
    } catch (err: any) {
        console.error("Error during test:", err?.message || err);
    }
}

// Run the test
runRecommendationTest();
