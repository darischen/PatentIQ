import { db } from './db';

export const logger = {
    /**
     * Logs a workflow execution.
     * Returns a log ID that can be used for API/LLM calls.
     */
    async startWorkflow(userId: string | null, workflowName: string) {
        try {
            const query = `
                INSERT INTO workflow_logs (user_id, workflow_name, status)
                VALUES ($1, $2, 'started')
                RETURNING id;
            `;
            const result = await db.query(query, [userId, workflowName]);
            return result.rows[0].id;
        } catch (error) {
            console.error('Logger (startWorkflow) failed:', error);
            return 'mock-workflow-uuid'; // Fallback
        }
    },

    async endWorkflow(logId: string, status: 'completed' | 'failed', errorMessage?: string) {
        if (logId === 'mock-workflow-uuid') return;
        try {
            const query = `
                UPDATE workflow_logs
                SET status = $2, end_time = NOW(), error_message = $3
                WHERE id = $1;
            `;
            await db.query(query, [logId, status, errorMessage || null]);
        } catch (error) {
            console.error('Logger (endWorkflow) failed:', error);
        }
    },

    /**
     * Logs an API or LLM call.
     */
    async logApiCall({
        workflowLogId,
        service,
        endpoint,
        requestParams,
        responseStatus,
        tokenUsage,
        errorMessage
    }: {
        workflowLogId?: string;
        service: 'USPTO' | 'LLM' | string;
        endpoint?: string;
        requestParams?: any;
        responseStatus?: number;
        tokenUsage?: number;
        errorMessage?: string;
    }) {
        try {
            const query = `
                INSERT INTO api_llm_logs (
                    workflow_log_id, service, endpoint, request_params, 
                    response_status, token_usage, error_message
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id;
            `;
            const result = await db.query(query, [
                workflowLogId === 'mock-workflow-uuid' ? null : (workflowLogId || null),
                service,
                endpoint || null,
                requestParams ? JSON.stringify(requestParams) : null,
                responseStatus || null,
                tokenUsage || null,
                errorMessage || null
            ]);
            return result.rows[0].id;
        } catch (error) {
            console.error('Logger (logApiCall) failed:', error);
            return 'mock-api-uuid';
        }
    }
};
