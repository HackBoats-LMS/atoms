import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">
      <div className="bg-gray-900 rounded-[32px] p-10 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Welcome to the Admin Portal</h1>
          <p className="text-gray-400 font-medium text-lg max-w-xl">
            You are securely logged in. From here you can manage directory members, bulk upload new datasets, and oversee the platform.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[10%] w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-[60px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/members">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group flex flex-col items-start h-full">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Members</h2>
            <p className="text-gray-500 font-medium text-sm">
              View, edit, or delete existing members currently listed in the digital directory.
            </p>
          </div>
        </Link>

        <Link href="/admin/members/upload">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group flex flex-col items-start h-full">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bulk Excel Upload</h2>
            <p className="text-gray-500 font-medium text-sm">
              Upload a new `.xlsx` file to instantly populate or update the directory with new data batches.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}