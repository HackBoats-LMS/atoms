"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminManagerClient({ initialAdmins }: { initialAdmins: any[] }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadMessage, setUploadMessage] = useState("")
    
    const router = useRouter()

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            setUploadMessage("Please provide both name and email.")
            return;
        }

        setUploading(true)
        setUploadMessage("")
        
        try {
            const res = await fetch("/api/auth/admin/upload", {
                method: "POST",
                body: JSON.stringify({ name, email }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            const data = await res.json()
            
            if (res.ok) {
                setUploadMessage(`Success: Admin ${name} added!`)
                setName('')
                setEmail('')
                router.refresh()
            } else {
                setUploadMessage(`Error: ${data.error || "Failed to add admin"}`)
            }
        } catch (error) {
            setUploadMessage("Error: Something went wrong during upload.")
        } finally {
            setUploading(false)
        }
    }

    const deleteAdmin = async (id: string, adminName: string) => {
        if (!confirm(`Are you sure you want to remove ${adminName || 'this admin'}?`)) return;
        
        try {
            const res = await fetch(`/api/auth/admin/${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                router.refresh()
            } else {
                alert("Failed to delete admin")
            }
        } catch (error) {
            alert("An error occurred while deleting")
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-12 font-sans'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-extrabold text-gray-900'>Admin Management</h1>
                    <p className='text-gray-500 mt-2'>Add new administrators or manage existing authorized users.</p>
                </div>

                <div className='flex flex-col lg:flex-row gap-8 items-start'>
                    
                    {/* Add Admin Form */}
                    <div className='w-full lg:w-[400px] shrink-0 sticky top-12'>
                        <div className='bg-white shadow-sm border border-gray-100 rounded-2xl p-8'>
                            <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Add New Admin
                            </h2>
                            
                            <form onSubmit={submitHandler} className='space-y-5'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='Admin Name' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Google Email</label>
                                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='admin@example.com' />
                                    <p className='text-xs text-gray-400 mt-1'>Must be the Google account they use to sign in.</p>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className={`w-full mt-4 font-bold py-3.5 rounded-xl transition shadow-sm flex justify-center items-center gap-2 ${uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'}`}
                                >
                                    {uploading ? 'Adding...' : 'Authorize Admin'}
                                </button>
                            </form>

                            {uploadMessage && (
                                <div className={`mt-5 p-4 rounded-xl text-sm border flex items-start gap-3 ${uploadMessage.includes('Error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                                    {uploadMessage.includes('Error') ? (
                                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                    <div>{uploadMessage}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Admin List */}
                    <div className='flex-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-8'>
                        <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            Authorized Administrators
                        </h2>

                        {initialAdmins.length === 0 ? (
                            <div className='text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
                                <p className='text-gray-500 font-medium'>No admin users found.</p>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='w-full text-left border-collapse'>
                                    <thead>
                                        <tr className='border-b border-gray-200'>
                                            <th className='py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider'>Name</th>
                                            <th className='py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider'>Email</th>
                                            <th className='py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider text-right'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-100'>
                                        {initialAdmins.map((admin) => (
                                            <tr key={admin.id} className='hover:bg-gray-50 transition'>
                                                <td className='py-4 px-4 text-sm text-gray-900 font-medium'>{admin.name || 'N/A'}</td>
                                                <td className='py-4 px-4 text-sm text-gray-600'>{admin.email}</td>
                                                <td className='py-4 px-4 text-right'>
                                                    <button 
                                                        onClick={() => deleteAdmin(admin.id, admin.name)}
                                                        className='inline-flex items-center justify-center p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors'
                                                        title="Revoke Admin Access"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
