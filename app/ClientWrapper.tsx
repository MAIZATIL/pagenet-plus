// app/ClientWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SocialPlatform = dynamic(
  () => import('./SocialPlatform'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading PageNet+...
      </div>
    ),
  }
);

export default function ClientWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          Loading PageNet+...
        </div>
      }
    >
      <SocialPlatform />
    </Suspense>
  );
}