import { Suspense } from 'react';
import RandomSelector from '@/components/RandomSelector';

export default function Home() {
  return (
    <div className="w-full">
      <Suspense fallback={<div className="text-center p-12 text-slate-500">Loading selector...</div>}>
        <RandomSelector />
      </Suspense>
    </div>
  );
}
