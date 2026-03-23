import OpenAI from 'openai';
import { PatentResult } from './query_builder';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// We extend the original result to include the AI's explanation
export interface RankedReasoning extends PatentResult {
  reasoning: string;
}

/**
 * Takes the ranked patents and asks the LLM to explain the match.
 */
export async function generateRankingReasoning(query: string, results: PatentResult[]): Promise<RankedReasoning[]> {
  try {
    // We run the LLM calls in parallel for speed using Promise.all
    const reasoningPromises = results.map(async (doc) => {
      
      // The context prompt we feed to the LLM
      const prompt = `
        You are an expert patent analyst.
        The user searched for: "${query}"
        
        Patent Title: ${doc.title}
        Patent Abstract: ${doc.abstract}
        Similarity Score: ${(doc.similarity_score * 100).toFixed(1)}%
        
        In exactly two concise sentences, explain WHY this patent is a strong match for the user's search query. Focus on the specific overlapping technical concepts.
      `;

      // Call the LLM (using gpt-4o-mini for speed and cost-efficiency)
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', 
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150, // Keep it from rambling
        temperature: 0.3, // Lower temperature for more factual, less creative responses
      });

      return {
        ...doc,
        reasoning: response.choices[0].message.content?.trim() || "No reasoning generated.",
      };
    });

    return await Promise.all(reasoningPromises);
  } catch (error) {
    console.error("Error generating reasoning:", error);
    throw new Error("Failed to generate AI reasoning");
  }
}