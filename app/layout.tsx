import type {Metadata} from 'next';
import { Pixelify_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const pixelFont = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chatbot - Ultra-Low Latency AI Assistant',
  description: 'Real-time AI Chatbot streaming over Server-Sent Events (SSE) with ultra-low latency, supporting custom system models, Groq, local Ollama, and Gemini.',
  openGraph: {
    title: 'Chatbot - Ultra-Low Latency AI Assistant',
    description: 'Real-time AI Chatbot streaming over Server-Sent Events (SSE) with ultra-low latency, supporting custom system models, Groq, local Ollama, and Gemini.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot - Ultra-Low Latency AI Assistant',
    description: 'Real-time AI Chatbot streaming over Server-Sent Events (SSE) with ultra-low latency, supporting custom system models, Groq, local Ollama, and Gemini.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${pixelFont.variable} min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] antialiased selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-black transition-colors duration-200 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}

