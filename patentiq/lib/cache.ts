import { LRUCache } from 'lru-cache';

// Cache for search results (Query Text -> Results)
// High hit rate expected for common searches. Kept around longer.
export const searchResultCache = new LRUCache<string, any>({
    max: 500, // Maximum number of unique search queries to hold in memory
    ttl: 1000 * 60 * 60, // 1 hour TTL
});

// Cache for user search history (User ID -> Search History Array)
// Cache per user to make UI navigation snappy.
export const userHistoryCache = new LRUCache<string, any[]>({
    max: 1000, // Maximum number of users' histories to hold
    ttl: 1000 * 60 * 15, // 15 minute TTL
});
