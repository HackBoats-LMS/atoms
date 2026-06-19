"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const Lightfall = dynamic(() => import("@/components/ui/Lightfall"), { ssr: false });

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans bg-slate-950 text-white">
      {/* Lightfall Background */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Lightfall
          colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
          backgroundColor="#030314"
          speed={1}
          streakCount={8}
          streakWidth={1.2}
          streakLength={1.5}
          glow={1.2}
          density={0.8}
          twinkle={0.8}
          zoom={2.5}
          backgroundGlow={0.7}
          opacity={1}
          mouseInteraction={true}
          mouseStrength={1.2}
          mouseRadius={0.7}
        />
      </div>

      {/* Main Glassmorphic Card */}
      <main className="relative z-10 flex flex-col items-center justify-between w-full max-w-xl p-8 md:p-12 mx-4 rounded-3xl border border-white/10 bg-black/45 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20 sm:items-start">
        <div className="w-full flex items-center justify-between mb-8">
          <Image
            className="invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 border border-white/10 text-zinc-300">
            v16.2.9
          </span>
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Welcome to Atoms
          </h1>
          <p className="max-w-md text-base md:text-lg leading-relaxed text-zinc-300">
            Lightfall integration is complete. To get started editing your project, open <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-sm text-pink-300">app/page.tsx</code>.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full mt-10 sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-black font-semibold transition-all duration-200 hover:bg-zinc-200 active:scale-95 sm:w-1/2"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-xl border border-white/10 px-5 text-white font-semibold transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-95 sm:w-1/2"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
