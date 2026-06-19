export default function Home() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center font-sans text-gray-900 relative"
      style={{ backgroundColor: '#C8C9C7' }}
    >
      {/* Header */}
      <header className="absolute top-0 w-full p-8 flex justify-center md:justify-start">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-black uppercase">
          ATOMS
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-gray-800 uppercase">
          Under Construction
        </h2>
        <p className="mt-6 text-gray-600 max-w-md text-lg">
          We are currently working on something amazing. Please check back soon.
        </p>
      </main>
    </div>
  );
}
