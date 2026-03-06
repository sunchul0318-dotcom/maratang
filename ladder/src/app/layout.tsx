import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Team Random Selector',
  description: 'A modern, simple random selector for teams. Choose presenters, menus, and more with exciting animations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
        <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-24 bg-gradient-to-br from-blue-50 to-indigo-50">
          {children}
        </main>
      </body>
    </html>
  );
}
