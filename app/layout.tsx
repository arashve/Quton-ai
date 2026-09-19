import type { Metadata, Viewport } from 'next';
import { Pixelify_Sans, Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppShell } from '@/components/shell';
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const pixelFont = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-pixel',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};
export const metadata: Metadata = {
  title: 'Quton',
  description: 'Real-time AI Chatbot streaming over Server-Sent Events (SSE) with ultra-low latency, supporting custom system models, Groq, local Ollama, and Gemini.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Quton',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
  <html lang="en" className={cn("dark", "font-sans", geist.variable)} suppressHydrationWarning>
  <body
    suppressHydrationWarning
    className={`${pixelFont.variable} min-h-dvh text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white transition-colors duration-200`}
  >
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}