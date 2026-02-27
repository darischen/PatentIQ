import { db } from './db';
import { SearchLog, SearchLogSchema } from './schemas';

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
        return result.rows[0];
    },

    /**
     * Retrieves the search history for a specific user.
     */
    async getSearchHistory(userId: string) {
        const query = `
      SELECT id, query_text, analysis_results, created_at
      FROM patent_queries
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
        const result = await db.query(query, [userId]);
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
