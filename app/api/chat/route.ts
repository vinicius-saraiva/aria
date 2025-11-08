import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { messages, location } = await request.json();

    // Build the system prompt with sailing expertise
    let systemPrompt = `You are an expert sailing weather assistant. You help sailors understand weather conditions, wind patterns, and weather systems.

Your expertise includes:
- Interpreting wind speed, direction, and patterns for sailing
- Explaining weather systems (high/low pressure, fronts, etc.)
- Advising on sailing conditions (good, challenging, dangerous)
- Understanding the Beaufort scale and its implications for sailing
- Identifying weather phenomena that affect sailing (sea breeze, katabatic winds, etc.)

When discussing weather:
- Always consider the sailing perspective
- Explain wind conditions in knots when relevant
- Mention sea state when applicable
- Warn about dangerous conditions
- Be clear and practical in your advice

Current context from earth.nullschool.net map:
- The map shows real-time global wind patterns and weather data
- Wind visualization includes speed (shown by animation intensity and color)
- Users can see surface-level wind patterns`;

    // Add location context if available
    if (location) {
      systemPrompt += `\n\nThe user has selected the following location:
- Latitude: ${location.lat}°
- Longitude: ${location.lon}°
- Timestamp: ${location.timestamp}

Please provide specific weather analysis for this location based on the user's questions.`;
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Sorry, I could not generate a response.';

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    // Provide helpful error messages
    if (error.message?.includes('api_key')) {
      return NextResponse.json(
        { error: 'API key not configured. Please set ANTHROPIC_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat request', details: error.message },
      { status: 500 }
    );
  }
}
