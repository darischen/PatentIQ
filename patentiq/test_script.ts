import { buildSafeQuery } from './lib/query_builder';
import { rankAndExplain } from './lib/ranking_engine';

// Mock test payload
const fakePayload = {
  select: ["title", "salary"],
  where: {
    logic: "AND",
    conditions: [
      { field: "title", operator: "LIKE", value: "Developer" }
    ]
  }
};

const mockData = [
  { id: 1, title: 'Software Engineer', salary: 120000, status: 'Interviewing' },
  { id: 2, title: 'Data Scientist', salary: 90000, status: 'Applied' },
  { id: 3, title: 'Frontend Developer', salary: 85000, status: 'Interviewing' },
  { id: 4, title: 'Backend Developer', salary: 110000, status: 'Offer' },
];

const customConditions = [
  { field: 'title', operator: 'LIKE', value: 'Developer' },
  { field: 'salary', operator: '>', value: 100000 },
];

console.log("Running Test Script...");
try {
    const safeQuery = buildSafeQuery(fakePayload);
    const rankedResults = rankAndExplain(mockData, customConditions);
    
    console.log(JSON.stringify({ 
        message: "SUCCESS! Query is perfectly safe.", 
        data: safeQuery,
        results: rankedResults
    }, null, 2));

} catch (error: any) {
    console.error({ 
        message: "BLOCKED! Validation caught an error.", 
        errors: error.issues 
    });
}
