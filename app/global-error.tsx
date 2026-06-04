'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Critical System Error</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            The application encountered a fatal error. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
