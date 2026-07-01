// app/page.tsx
import dynamic from 'next/dynamic';

const SocialPlatform = dynamic(() => import('./SocialPlatform'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      Loading...
    </div>
  )
});

export default function Page() {
  return <SocialPlatform />;
}