import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-teal-700">VisaTrack Malta</h1>
      </div>

      <div className="mt-10 text-center">
        <p className="mb-4 text-xl">Compliance for Maltese Employers hiring TCNs.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">
            Login
          </Link>
          <Link href="/dashboard" className="border border-teal-600 text-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 transition">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
