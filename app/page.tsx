import Link from "next/link";
import { getCachedSettings } from "@/lib/settings";

export default async function Home() {
  const settings = await getCachedSettings();
  const appName = settings?.appName || "Atoms";

  return (
    <div className="min-h-screen w-full font-sans bg-[#e5e5e5] text-gray-900 selection:bg-gray-900 selection:text-white pb-20">

      {/* Navigation */}
      <nav className="w-full flex items-center justify-between p-6 sm:p-10 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <span className="text-xl font-extrabold tracking-widest uppercase text-black">
            {appName}
          </span>
        </div>
        <div className="flex items-center gap-4">

          <Link href="/directory" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-md">
            View Directory
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 sm:px-10 mt-10 md:mt-20 flex flex-col items-center text-center">

        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-gray-300 bg-white/50 backdrop-blur-sm text-xs font-bold text-gray-600 uppercase tracking-wider">
          The New Standard in Discovery
        </div>

        <h1 className="text-[40px] sm:text-[64px] md:text-[80px] font-extrabold leading-[1.05] tracking-tight max-w-4xl text-[#111111]">
          Connect with the <br className="hidden sm:block" />
          best <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">brands & creators.</span>
        </h1>

        <p className="mt-6 sm:mt-8 text-gray-600 max-w-xl text-[16px] sm:text-[18px] leading-relaxed">
          {appName} is a curated digital directory designed to help you discover, connect, and collaborate with industry-leading professionals and cutting-edge businesses.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/directory" className="bg-black text-white px-8 py-4 rounded-full text-[15px] font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2">
            Explore Directory
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

        </div>
      </main>

      {/* Bento Grid Features */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 mt-24 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
              <svg className="w-6 h-6 text-gray-900 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Discovery</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Instantly search through categories, names, and skills to find exactly who or what you're looking for with our lightning-fast search.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111111] rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-gray-800 rounded-full opacity-20 blur-3xl"></div>

            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Premium Profiles</h3>
            <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">
              Each member gets a beautifully crafted profile showcasing their brands, unique selling propositions, and top clients.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-50 transition-colors">
              <svg className="w-6 h-6 text-gray-900 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Connections</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Connect instantly via WhatsApp, Email, or Social Media. Skip the friction and get straight to building meaningful relationships.
            </p>
          </div>

        </div>
      </section>

      {/* Footer / Bottom CTA */}
      <footer className="max-w-[1400px] mx-auto px-6 sm:px-10 mt-24">
        <div className="bg-white rounded-[40px] p-10 md:p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <div className="w-6 h-6 bg-black rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Ready to discover?</h2>
          <p className="text-gray-500 text-[16px] max-w-lg mb-8">
            Join thousands of professionals already using {appName} to expand their network and showcase their businesses.
          </p>
          <Link href="/directory" className="bg-black text-white px-8 py-4 rounded-full text-[15px] font-bold hover:bg-gray-800 transition shadow-lg">
            Enter the Directory
          </Link>
        </div>

        <div className="mt-10 text-center text-gray-400 text-sm font-medium">
          © {new Date().getFullYear()} {appName} Directory. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
