import { db } from '../database/db';

type RateLimitResponse = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number; // Unix timestamp
    message?: string;
};

/**
 * Validates a rate limit key. If limit is exceeded, returns success: false.
 */
async function checkRateLimit(key: string, limit: number, durationMs: number, errorMessageTemplate: string): Promise<RateLimitResponse> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMs);

    try {
        const query = `
            INSERT INTO rate_limits (key, count, expires_at)
            VALUES ($1, 1, $2)
            ON CONFLICT (key) DO UPDATE SET
                count = CASE 
                    WHEN rate_limits.expires_at < NOW() THEN 1 
                    ELSE rate_limits.count + 1 
                END,
                expires_at = CASE 
                    WHEN rate_limits.expires_at < NOW() THEN EXCLUDED.expires_at 
                    ELSE rate_limits.expires_at 
                END
            RETURNING count, expires_at;
        `;

        const result = await db.query(query, [key, expiresAt]);
        const { count, expires_at } = result.rows[0];

        const success = count <= limit;
        const resetTime = new Date(expires_at).getTime();

        return {
            success,
            limit,
            remaining: Math.max(0, limit - count),
            reset: resetTime,
            message: success ? undefined : errorMessageTemplate.replace('{limit}', limit.toString())
        };
    } catch (error) {
        console.error('[RateLimit] Database error (gracefully bypassing):', error);
        return {
            success: true,
            limit,
            remaining: limit - 1,
            reset: Date.now() + durationMs
        };
    }
}

/**
 * Throttles an async operation. If the rate limit is hit, it waits and retries.
 */
export async function throttleCall<T>(checkLimitFn: () => Promise<RateLimitResponse>, operation: () => Promise<T>): Promise<T> {
    const limitCheck = await checkLimitFn();
    if (limitCheck.success) {
        return operation();
    }

    const waitTimeMs = Math.max(0, limitCheck.reset - Date.now());
    console.log(`[Throttle] Rate limit exceeded. Throttling/Queueing for ${waitTimeMs}ms...`);

    // In a real distributed system, we'd use Redis Pub/Sub or SQS. 
    // Here we use a simple timeout for demonstration.
    await new Promise(resolve => setTimeout(resolve, waitTimeMs));

    // Allow the call to proceed after waiting
    return operation();
}

export const ratelimit = {
    async checkWorkflow(userId: string): Promise<RateLimitResponse> {
        return checkRateLimit(`workflow:${userId}:second`, 1, 1000, "Rate limit exceeded. Maximum {limit} submission per second. Please try again in a moment.");
    },
    async checkUSPTO(): Promise<RateLimitResponse> {
        return checkRateLimit(`uspto:system:minute`, 10, 60 * 1000, "USPTO API limits reached. Request queued/throttled.");
    },
    async checkLLM(userId: string | 'system' = 'system'): Promise<RateLimitResponse> {
        return checkRateLimit(`llm:${userId}:minute`, 20, 60 * 1000, "LLM limits reached. Request queued/throttled.");
    }
};
