// app/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import dengan SSR disabled
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

export default function Page() {
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