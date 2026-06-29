"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClassesClient({ classes }: { classes: any[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [newClassDesc, setNewClassDesc] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/class', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newClassName, description: newClassDesc })
            });
            const data = await res.json();
            if (data.success) {
                setNewClassName("");
                setNewClassDesc("");
                setIsCreating(false);
                router.refresh(); // Tells Next.js to re-fetch the Server Component data
            } else {
                alert(data.message || "Failed to create class");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this powerteam? Members in this powerteam will not be deleted, but they will be removed from the powerteam.")) return;
        try {
            const res = await fetch(`/api/class/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Manage Powerteams</h1>
                        <p className="text-gray-500 mt-2">Create powerteams and group your members.</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition flex items-center gap-2"
                    >
                        {isCreating ? "Cancel" : "+ Create Powerteam"}
                    </button>
                </div>

                {isCreating && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Powerteam</h2>
                        <form onSubmit={handleCreateClass} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Powerteam Name <span className="text-red-500">*</span></label>
                                <input required type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400" placeholder="e.g. IT & Software Powerteam" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input type="text" value={newClassDesc} onChange={(e) => setNewClassDesc(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400" placeholder="Optional description" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-black transition disabled:opacity-50">
                                {isSubmitting ? 'Saving...' : 'Save Powerteam'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Powerteam Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Members</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {classes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No powerteams found.</td>
                                </tr>
                            ) : (
                                classes.map(cls => (
                                    <tr key={cls.classId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{cls.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{cls.description || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cls._count?.members || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/admin/classes/${cls.classId}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Manage Members</Link>
                                            <button onClick={() => handleDelete(cls.classId)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
