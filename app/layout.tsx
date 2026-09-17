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
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  title: 'Quton',
  description: 'Real-time AI Chatbot streaming over Server-Sent Events (SSE) with ultra-low latency, supporting custom system models, Groq, local Ollama, and Gemini.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Quton',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-touch-fullscreen': 'yes',
    'msapplication-navbutton-color': '#000000',
  },
  openGraph: {
    title: 'Quton',
    description: 'Real-time AI Chatbot...',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quton',
    description: 'Real-time AI Chatbot...',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html 
      lang="en" 
      className={cn("dark", "font-sans bg-black", geist.variable)} 
      suppressHydrationWarning
    >
      {/* تگ head دستی حذف شد تا خود Next.js آن را مدیریت کند */}
      <body
        suppressHydrationWarning
        className={`${pixelFont.variable} min-h-screen min-h-[100dvh] bg-black text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white transition-colors duration-200`}
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