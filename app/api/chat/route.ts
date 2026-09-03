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
    const {
      messages = [],
      mode = 'default',
      systemPrompt,
      temperature = 0.7,
      model,
      provider: requestedProvider,
      apiKey: userApiKey,
      baseUrl: userBaseUrl,
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty.' },
        { status: 400 }
      );
    }

    // استخراج یکپارچه متن پیام‌ها از هر دو فرمت content و parts
    const normalizedMessages = messages
      .map((m: any) => {
        let text = '';
        if (typeof m.content === 'string') {
          text = m.content;
        } else if (Array.isArray(m.parts)) {
          text = m.parts.map((p: any) => (typeof p === 'string' ? p : p.text || '')).join('');
        }
        const role = m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user';
        return { role, text: text.trim() };
      })
      .filter((m) => m.text.length > 0);

    if (normalizedMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid message text found in payload.' },
        { status: 400 }
      );
    }

    // تعیین Provider و مدل بر اساس درخواست کاربر
    const groqEnvKey = process.env.GROQ_API_KEY || '';
    const geminiEnvKey = process.env.GEMINI_API_KEY || '';
    const openaiEnvKey = process.env.OPENAI_API_KEY || '';

    let resolvedProvider: 'groq' | 'gemini' | 'ollama' | 'openai' | 'custom' = 'gemini';

    if (requestedProvider && ['groq', 'gemini', 'ollama', 'openai', 'custom'].includes(requestedProvider)) {
      resolvedProvider = requestedProvider;
    } else if (userBaseUrl && (userBaseUrl.includes('11434') || userBaseUrl.includes('ollama'))) {
      resolvedProvider = 'ollama';
    } else if (
      (model && (model.includes('gpt-oss') || model.startsWith('llama-') || model.startsWith('mixtral') || model.startsWith('deepseek-r1'))) ||
      (userApiKey && isGroqKey(userApiKey)) ||
      (groqEnvKey && isGroqKey(groqEnvKey) && (!model || !model.startsWith('gemini')))
    ) {
      resolvedProvider = 'groq';
    } else if (model && model.startsWith('gemini')) {
      resolvedProvider = 'gemini';
    } else if (userApiKey?.startsWith('sk-') || openaiEnvKey) {
      resolvedProvider = 'openai';
    } else if (model && !model.startsWith('gemini')) {
      // اگر کاربر مدلی غیراز جیمینی مشخص کرده است
      resolvedProvider = 'groq';
    }

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

    // مسیر ۱: پردازش با Groq
    if (resolvedProvider === 'groq') {
      const activeGroqKey = (userApiKey && userApiKey.trim()) || groqEnvKey;
      const activeModel = model || 'openai/gpt-oss-120b';

      if (!activeGroqKey) {
        const stream = new ReadableStream({
          start(controller) {
            const errorMsg = `⚠️ Groq API key not found. Please provide a Groq API Key (starts with \`gsk_\`) in the Model Settings menu, or set \`GROQ_API_KEY\` in your environment variables. Selected model: **${activeModel}**.`;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: errorMsg, model: activeModel })}\n\n`));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, model: activeModel })}\n\n`));
            controller.close();
          },
        });
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
          },
        });
      }

      process.env.GROQ_API_KEY = activeGroqKey;
      const formattedMessages = normalizedMessages.map((m) => ({
        role: m.role as 'assistant' | 'user',
        content: m.text,
      }));

      const result = streamText({
        model: groq(activeModel),
        system: instruction,
        messages: formattedMessages,
        temperature,
      });

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const delta of result.textStream) {
              if (delta) {
                const data = `data: ${JSON.stringify({ chunk: delta, model: activeModel })}\n\n`;
                controller.enqueue(encoder.encode(data));
              }
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, model: activeModel })}\n\n`));
            controller.close();
          } catch (err: any) {
            console.error('Groq streaming error:', err);
            const errData = `data: ${JSON.stringify({ chunk: `\n[Groq Error (${activeModel}): ${err?.message || 'Streaming failed'}]`, done: true })}\n\n`;
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

    // مسیر ۲: پردازش با Ollama یا سرور سازگار با OpenAI یا مدل محلی سیستم
    if (resolvedProvider === 'ollama' || resolvedProvider === 'openai' || resolvedProvider === 'custom') {
      const activeModel = model || (resolvedProvider === 'ollama' ? 'llama3.2' : 'gpt-4o-mini');
      let targetUrl = userBaseUrl || (resolvedProvider === 'ollama' ? 'http://localhost:11434' : 'https://api.openai.com/v1');
      
      // اصلاح آدرس endpoint
      let endpoint = targetUrl;
      if (!endpoint.endsWith('/chat/completions') && !endpoint.endsWith('/api/chat')) {
        if (resolvedProvider === 'ollama' && !endpoint.includes('/v1')) {
          endpoint = endpoint.replace(/\/+$/, '') + '/v1/chat/completions';
        } else {
          endpoint = endpoint.replace(/\/+$/, '') + (endpoint.endsWith('/v1') ? '/chat/completions' : '/v1/chat/completions');
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      const activeKey = userApiKey || openaiEnvKey;
      if (activeKey) {
        headers['Authorization'] = `Bearer ${activeKey}`;
      }

      const formattedMessages = [
        { role: 'system', content: instruction },
        ...normalizedMessages.map((m) => ({
          role: m.role,
          content: m.text,
        })),
      ];

      const stream = new ReadableStream({
        async start(controller) {
          try {
            const externalResponse = await fetch(endpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                model: activeModel,
                messages: formattedMessages,
                stream: true,
                temperature,
              }),
            });

            if (!externalResponse.ok || !externalResponse.body) {
              const errBody = await externalResponse.text().catch(() => '');
              throw new Error(`Endpoint returned status ${externalResponse.status}: ${errBody || externalResponse.statusText}`);
            }

            const reader = externalResponse.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith(':')) continue;

                if (trimmed.startsWith('data: ')) {
                  const dataStr = trimmed.slice(6).trim();
                  if (dataStr === '[DONE]') {
                    break;
                  }
                  try {
                    const parsed = JSON.parse(dataStr);
                    const delta = parsed.choices?.[0]?.delta?.content || parsed.message?.content || '';
                    if (delta) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: delta, model: activeModel })}\n\n`));
                    }
                  } catch {
                    // Ignore JSON parsing errors for partial chunks
                  }
                }
              }
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, model: activeModel })}\n\n`));
            controller.close();
          } catch (err: any) {
            console.error('Custom endpoint streaming error:', err);
            const errData = `data: ${JSON.stringify({ chunk: `\n[Model Error (${activeModel}): ${err?.message || 'Connection failed to ' + endpoint}]`, done: true })}\n\n`;
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

    // مسیر ۳: پردازش با موتور Gemini
    const activeGeminiKey = (userApiKey && !isGroqKey(userApiKey) ? userApiKey : '') || geminiEnvKey;
    const activeGeminiModel = model && model.startsWith('gemini') ? model : 'gemini-2.5-flash';

    if (!activeGeminiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is required but not found in environment or request.' },
        { status: 500 }
      );
    }

    const ai = getGeminiClient(activeGeminiKey);
    const contents = normalizedMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const responseStream = await ai.models.generateContentStream({
      model: activeGeminiModel,
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
              const data = `data: ${JSON.stringify({ chunk: text, model: activeGeminiModel })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, model: activeGeminiModel })}\n\n`));
          controller.close();
        } catch (error: any) {
          console.error('Gemini streaming error:', error);
          const errData = `data: ${JSON.stringify({ chunk: `\n[Error: ${error?.message || 'Streaming failed'}]`, done: true })}\n\n`;
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