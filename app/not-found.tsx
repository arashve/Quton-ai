import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-6xl font-bold tracking-tight text-zinc-200">404</h1>
        <h2 className="text-xl font-semibold text-zinc-300">Page Not Found</h2>
        <p className="text-sm text-zinc-500">
          The requested page could not be located.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
          >
            Return to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
