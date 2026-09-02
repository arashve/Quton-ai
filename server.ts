import express, { Request, Response } from 'express';
import cors from 'cors';
import next from 'next';
import { GoogleGenAI } from '@google/genai';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Gemini API calls will fail without a valid key.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

nextApp.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  server.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      model: 'gemini-3.7-flash',
      runtime: 'node-express',
      timestamp: new Date().toISOString(),
    });
  });

  // Real-time Chat SSE Endpoint
  server.post('/api/chat', async (req: Request, res: Response) => {
    const {
      messages = [],
      mode = 'default',
      systemPrompt,
      temperature = 0.7,
    } = req.body;

    // Validate request
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required and cannot be empty.' });
      return;
    }

    // Set Server-Sent Events (SSE) headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof (res as any).flushHeaders === 'function') {
      (res as any).flushHeaders();
    }

    let isAborted = false;
    req.on('close', () => {
      isAborted = true;
    });

    try {
      const ai = getGeminiClient();

      // Format conversation contents for Gemini SDK
      // Each message in contents has role: 'user' | 'model' and parts array
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Base system instruction tailored for ultra-low latency and clean responses
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

      // Stream content chunk-by-chunk using gemini-3.7-flash
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction: instruction,
          temperature: typeof temperature === 'number' ? temperature : 0.7,
        },
      });

      for await (const chunk of responseStream) {
        if (isAborted) break;
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
          if (typeof (res as any).flush === 'function') {
            (res as any).flush();
          }
        }
      }

      if (!isAborted) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      }
      res.end();
    } catch (err: any) {
      console.error('Gemini streaming error in Express server:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: err?.message || 'Internal server error while streaming' });
      } else {
        res.write(`data: ${JSON.stringify({ error: err?.message || 'Stream encountered an error' })}\n\n`);
        res.end();
      }
    }
  });

  // Next.js page handler fallback for all other routes
  server.all(/.*/, (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Chatbot server listening on http://localhost:${port} (mode: ${dev ? 'development' : 'production'})`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
