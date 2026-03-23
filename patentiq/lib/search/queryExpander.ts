import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QueryExpansionResult {
  expanded: string;
  concepts: string[];
}

/**
 * Uses LLM to expand a user's invention description into a richer query
 * optimized for vector similarity search. Extracts key technical concepts
 * and generates synonym-enriched text for broader patent coverage.
 */
export async function expandQueryWithLLM(userInput: string): Promise<QueryExpansionResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a patent search query optimizer. Given an invention description, extract the key technical concepts and expand them with synonyms, related terms, and alternative phrasings used in patent literature.

Return valid JSON with this structure:
{
  "concepts": ["concept1", "concept2", ...],
  "expanded": "A single enriched paragraph combining the original description with technical synonyms, alternative phrasings, and related patent terminology to maximize vector search recall."
}

Guidelines:
- Extract 3-6 core technical concepts
- Include industry-standard terminology and patent-specific phrasing
- Add relevant synonyms and alternative descriptions for each concept
- The expanded text should read naturally and capture the full technical scope
- Do NOT add invented features - only expand what the user described`,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      expanded: result.expanded || userInput,
      concepts: result.concepts || [],
    };
  } catch (error) {
    console.error('[Query Expander] LLM expansion failed, using original input:', error);
    return { expanded: userInput, concepts: [] };
  }
}
