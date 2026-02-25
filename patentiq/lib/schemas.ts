import { z } from 'zod';

export const SearchLogSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid().optional(),
    query_text: z.string().min(1),
    analysis_results: z.any().optional(),
    created_at: z.date().optional(),
});

export type SearchLog = z.infer<typeof SearchLogSchema>;

export const UserFeedbackSchema = z.object({
    query_id: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    feedback_text: z.string().optional(),
});

export type UserFeedback = z.infer<typeof UserFeedbackSchema>;
