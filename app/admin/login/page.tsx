"use client"

import { signIn } from 'next-auth/react'

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>

      <div className="w-full max-w-[440px] bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative z-10 border border-gray-100/50">
        
        {/* Logo or Brand */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-extrabold tracking-tighter">A</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Sign in to manage the Atoms directory.
          </p>
        </div>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full relative flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-900 font-bold text-sm md:text-base py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 font-medium">
            Secure access restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  )
}