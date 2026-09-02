import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

function isGroqKey(key?: string): boolean {
  return typeof key === 'string' && key.startsWith('gsk_');
}

function getGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], mode = 'default', systemPrompt, temperature = 0.7 } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty.' },
        { status: 400 }
      );
    }

    // تشخیص کلید Groq یا Gemini
    const rawKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || '';
    const useGroq = isGroqKey(rawKey);

    // تنظیم پرامپت سیستمی
    let instruction =
      'You are Chatbot, an ultra-fast, modern, and highly capable AI assistant specializing in rapid prototyping, wireframing, architecture, product MVP planning, deep research, coding, and API integrations. ' +
      'Deliver concise, crisp, and high-impact responses formatted in clean Markdown. ' +
      'When providing code or UI wireframes, provide modern, production-grade snippets with clear explanations. Avoid repetitive pleasantries or meta-chatter.';

    if (mode === 'research') {
      instruction += ' Provide an in-depth, structured research brief with key findings, architectural trade-offs, and actionable steps.';
    } else if (mode === 'study') {
      instruction += ' Break down concepts systematically with clear pedagogical explanations, key analogies, and structured summaries.';
    } else if (mode === 'wireframes' || mode === 'prototype') {
      instruction += ' Provide detailed UI component specifications, layout ASCII/Bento grids, Tailwind CSS classes, and reactive state structures.';
    }

    if (systemPrompt && typeof systemPrompt === 'string') {
      instruction = `${instruction} ${systemPrompt}`;
    }

    const encoder = new TextEncoder();

    // مسیر ۱: پردازش با موتور پرسرعت Groq
    if (useGroq) {
      process.env.GROQ_API_KEY = rawKey;
      const modelName = 'llama-3.3-70b-versatile';

      const formattedMessages = messages
        .filter((m: any) => m.content && m.content.trim() !== '')
        .map((m: any) => ({
          role: (m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: m.content,
        }));

      const result = streamText({
        model: groq(modelName),
        system: instruction,
        messages: formattedMessages,
        temperature,
      });

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const delta of result.textStream) {
              if (delta) {
                const data = `data: ${JSON.stringify({ chunk: delta, model: modelName })}\n\n`;
                controller.enqueue(encoder.encode(data));
              }
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, model: modelName })}\n\n`));
            controller.close();
          } catch (err: any) {
            console.error('Groq streaming error:', err);
            const errData = `data: ${JSON.stringify({ error: err?.message || 'Streaming error' })}\n\n`;
            controller.enqueue(encoder.encode(errData));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // مسیر ۲: پردازش با موتور Gemini
    const ai = getGeminiClient(rawKey);
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: instruction,
        temperature,
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              const data = `data: ${JSON.stringify({ chunk: text, model: 'gemini-2.5-flash' })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, model: 'gemini-2.5-flash' })}\n\n`));
          controller.close();
        } catch (error: any) {
          console.error('Gemini streaming error:', error);
          const errData = `data: ${JSON.stringify({ error: error?.message || 'Streaming error' })}\n\n`;
          controller.enqueue(encoder.encode(errData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/chat route handler:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}