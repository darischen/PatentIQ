import { db } from './db';
import { SearchLog, SearchLogSchema } from './schemas';
import { searchResultCache, userHistoryCache } from './cache';

export const patentRepository = {
  /**
   * Saves a new patent search query and its results to the database.
   * Aligns with Layer 4 (Data Layer) and Layer 5 (Archival Layer) requirements.
   */
  async saveSearchQuery(log: SearchLog) {
    // Validate the data before saving
    const validatedData = SearchLogSchema.parse(log);

    const query = `
      INSERT INTO patent_queries (
        user_id, 
        query_text, 
        analysis_results
      ) 
      VALUES ($1, $2, $3) 
      RETURNING id, created_at;
    `;

    const values = [
      validatedData.user_id || null,
      validatedData.query_text,
      validatedData.analysis_results || null,
    ];

    const result = await db.query(query, values);
    const savedRecord = result.rows[0];

    // 1. Cache the newly saved query using query_text.
    // This ensures the next person who runs the exact same search gets instant results.
    if (savedRecord && savedRecord.analysis_results) {
      searchResultCache.set(savedRecord.query_text, {
        id: savedRecord.id,
        query_text: savedRecord.query_text,
        analysis_results: savedRecord.analysis_results,
        created_at: savedRecord.created_at
      });
    }

    // 2. Invalidate the user's specific history cache
    // So their history page reflects this new search immediately.
    if (savedRecord && savedRecord.user_id) {
      userHistoryCache.delete(savedRecord.user_id);
    }

    return savedRecord;
  },

  /**
   * Checks if a previous search exists for the exact query text to avoid redundant LLM/DB calls.
   */
  async getSearchByQueryText(queryText: string) {
    // Quick Cache Check
    if (searchResultCache.has(queryText)) {
      console.log(`[Cache Hit] Instant results for: "${queryText}"`);
      return searchResultCache.get(queryText);
    }

    console.log(`[Cache Miss] DB lookup for: "${queryText}"`);
    const query = `
            SELECT id, query_text, analysis_results, created_at
            FROM patent_queries
            WHERE query_text = $1
            ORDER BY created_at DESC
            LIMIT 1;
        `;
    const result = await db.query(query, [queryText]);
    const record = result.rows[0];

    // Save into cache for the next time
    if (record) {
      searchResultCache.set(queryText, record);
    }

    return record || null;
  },

  /**
   * Retrieves the search history for a specific user.
   */
  async getSearchHistory(userId: string) {
    // Fast-path: Check memory cache first
    if (userId && userHistoryCache.has(userId)) {
      console.log(`[Cache Hit] Returning snappy user history for User: ${userId}`);
      return userHistoryCache.get(userId);
    }

    console.log(`[Cache Miss] Fetching history from DB for User: ${userId}`);
    const query = `
      SELECT id, query_text, analysis_results, created_at
      FROM patent_queries
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [userId]);

    // Save the fetched history to our cache
    if (userId) {
      userHistoryCache.set(userId, result.rows);
    }

    return result.rows;
  },

  /**
   * Captures raw search logs for audit and transparency (Layer 5 requirement).
   */
  async captureLog(queryId: string, eventDetails: any) {
    // This could go into a separate logs table or update existing query record
    // For now, let's keep it simple and log to console if table isn't ready,
    // or expand the schema later as per data science needs.
    console.log(`[Layer 5 Log] Query ID: ${queryId}`, eventDetails);
  }
};
