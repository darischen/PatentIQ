import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        reply:
          "I understand you're describing a technical innovation. Could you elaborate on the specific mechanism or technical advantage that makes your approach different from existing solutions?",
      });
    }

    const openai = new OpenAI();

    const messages = [
      {
        role: 'system' as const,
        content:
          "You are a world-class patent attorney agent. Ask deep technical follow-up questions to explore the user's invention. Be concise.",
      },
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'bot' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
    });

    return NextResponse.json({
      reply:
        completion.choices[0]?.message?.content || 'Could you elaborate further?',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
