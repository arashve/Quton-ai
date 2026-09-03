import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen relative w-full h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-200">
      <Chat />
    </main>
  );
}

