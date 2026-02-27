// scripts/verify-cache.js
// Note: You may need to run this with `npx tsx scripts/verify-cache.js` or `npm run dev` and test via the UI if your environment doesn't transpile TS automatically.

const { patentRepository } = require('../lib/repository');

async function testCache() {
    console.log('--- Starting Cache Layer Verification ---');

    try {
        const mockUserId = '11111111-1111-1111-1111-111111111111'; // Dummy UUID for postgres
        const mockQueryText = 'Test patent idea: A smart coffee mug that never spills.';

        console.log('\n[TEST 1] Testing Cache Miss on user history (should query DB)');
        await patentRepository.getSearchHistory(mockUserId);

        console.log('\n[TEST 2] Testing Cache Hit on user history (should return instantly)');
        await patentRepository.getSearchHistory(mockUserId);

        console.log('\n[TEST 3] Testing Cache Miss on search by query (should query DB)');
        await patentRepository.getSearchByQueryText(mockQueryText);

        console.log('\n[TEST 4] Testing Cache Hit on search by query (should return instantly)');
        await patentRepository.getSearchByQueryText(mockQueryText);

        console.log('\n[TEST 5] Creating new query to test invalidation');
        await patentRepository.saveSearchQuery({
            user_id: mockUserId,
            query_text: mockQueryText,
            analysis_results: { status: 'success', note: 'cache test' },
            created_at: new Date()
        });

        console.log('\n[TEST 6] Checking user history again (should be Cache Miss due to invalidation)');
        await patentRepository.getSearchHistory(mockUserId);

        console.log('\n--- Cache Verification Complete: SUCCESS ---');
        process.exit(0);
    } catch (err) {
        console.error('\n--- Cache Verification Failed ---', err);
        process.exit(1);
    }
}

testCache();
