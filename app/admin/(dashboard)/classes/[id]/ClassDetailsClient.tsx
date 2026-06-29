"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClassDetailsClient({ classData, allMembers, classId }: { classData: any, allMembers: any[], classId: string }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    const handleAssign = async (memberId: string) => {
        setProcessingId(memberId);
        try {
            const res = await fetch(`/api/class/${classId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'assign', memberId })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleRemove = async (memberId: string) => {
        setProcessingId(memberId);
        try {
            const res = await fetch(`/api/class/${classId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'remove', memberId })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    const classMemberIds = classData.members.map((m: any) => m.memberId);
    
    // Filter out members that are already in the class
    const availableMembers = allMembers.filter(m => !classMemberIds.includes(m.memberId));
    
    const searchResults = searchQuery.trim() === "" 
        ? [] 
        : availableMembers.filter(m => 
            m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.phone?.includes(searchQuery)
          ).slice(0, 5); // Show top 5 results

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/admin/classes" className="text-gray-500 hover:text-gray-800 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </Link>
                            <h1 className='text-3xl font-extrabold text-gray-900'>{classData.name}</h1>
                        </div>
                        <p className='text-gray-500 ml-9'>{classData.description || 'Manage members for this powerteam.'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Assigned Members */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{classData.members.length}</span>
                            Assigned Members
                        </h2>
                        
                        <div className="space-y-3">
                            {classData.members.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No members assigned to this powerteam yet.</p>
                            ) : (
                                classData.members.map((member: any) => (
                                    <div key={member.memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{member.name}</p>
                                            <p className="text-xs text-gray-500">{member.email || member.phone || 'No contact info'}</p>
                                        </div>
                                        <button disabled={processingId === member.memberId} onClick={() => handleRemove(member.memberId)} className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 disabled:opacity-50">
                                            {processingId === member.memberId ? 'Removing...' : 'Remove'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Search and Assign */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Add Members</h2>
                        <div className="relative mb-4">
                            <input 
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        {searchQuery.trim() !== "" && (
                            <div className="space-y-2 mt-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Results</h3>
                                {searchResults.length === 0 ? (
                                    <p className="text-sm text-gray-500">No available members found.</p>
                                ) : (
                                    searchResults.map((member: any) => (
                                        <div key={member.memberId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div>
                                                <p className="font-bold text-sm text-blue-900">{member.name}</p>
                                                <p className="text-xs text-blue-700">{member.email || member.phone || 'No contact info'}</p>
                                            </div>
                                            <button disabled={processingId === member.memberId} onClick={() => handleAssign(member.memberId)} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-blue-700 transition disabled:opacity-50">
                                                {processingId === member.memberId ? 'Adding...' : 'Add'}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
