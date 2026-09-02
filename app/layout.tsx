import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Chatbot - Ultra-Low Latency AI Assistant',
  description: 'Real-time AI Chatbot powered by Node.js Express and Gemini 3.7 Flash streaming over Server-Sent Events (SSE) with ultra-low latency and modern glassmorphic UI.',
  openGraph: {
    title: 'Chatbot - Ultra-Low Latency AI Assistant',
    description: 'Real-time AI Chatbot powered by Node.js Express and Gemini 3.7 Flash streaming over Server-Sent Events (SSE) with ultra-low latency and modern glassmorphic UI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot - Ultra-Low Latency AI Assistant',
    description: 'Real-time AI Chatbot powered by Node.js Express and Gemini 3.7 Flash streaming over Server-Sent Events (SSE) with ultra-low latency and modern glassmorphic UI.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark bg-[#0d0d0d] text-zinc-300 antialiased selection:bg-zinc-800 selection:text-zinc-100">
      <body suppressHydrationWarning className="min-h-screen bg-[#0d0d0d] text-zinc-300 overflow-x-hidden">{children}</body>
    </html>
  );
}
