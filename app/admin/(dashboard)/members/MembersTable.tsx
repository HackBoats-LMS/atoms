"use client"

import React, { useState } from 'react';
import Link from 'next/link';

type Member = {
    memberId: string;
    name: string;
    email: string | null;
    phone: string | null;
    postName: string | null;
    businesses?: any[];
};

export default function MembersTable({ initialMembers }: { initialMembers: Member[] }) {
    const [members, setMembers] = useState(initialMembers);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to completely delete this member? This action cannot be undone.")) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/member/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMembers(prev => prev.filter(m => m.memberId !== id));
            } else {
                alert("Failed to delete member");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredMembers = members.filter(m => 
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search members by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition"
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Businesses</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMembers.map(member => (
                        <tr key={member.memberId} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.postName || 'Member'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{member.email || 'No email'}</div>
                                <div className="text-sm text-gray-500">{member.phone || 'No phone'}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {member.businesses && member.businesses.length > 0 
                                        ? member.businesses.map(b => b.bussinessName).join(", ") 
                                        : "None"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/admin/members/${member.memberId}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDelete(member.memberId)} 
                                    disabled={deletingId === member.memberId}
                                    className={`${deletingId === member.memberId ? 'text-gray-400' : 'text-red-600 hover:text-red-900'}`}
                                >
                                    {deletingId === member.memberId ? 'Deleting...' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredMembers.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                                No members found matching your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </div>
    );
}
