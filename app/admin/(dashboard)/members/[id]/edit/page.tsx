"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditMemberPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [member, setMember] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        postName: "",
        usp: "",
        whatWeDo: "",
        instagramUrl: "",
        profileImageUrl: "",
        bussinesses: [] as any[],
        clients: [] as any[],
        classId: ""
    });

    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [memberRes, classRes] = await Promise.all([
                    fetch(`/api/member/${id}`),
                    fetch(`/api/class`)
                ]);

                if (memberRes.ok) {
                    const data = await memberRes.json();
                    setMember({
                        ...data,
                        bussinesses: data.businesses || [],
                        clients: data.clients || [],
                        classId: data.classId || ""
                    });
                } else {
                    setMessage("Member not found");
                }

                if (classRes.ok) {
                    const classData = await classRes.json();
                    if (classData.success) {
                        setClasses(classData.classes);
                    }
                }
            } catch (err) {
                console.error(err);
                setMessage("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMember(prev => ({ ...prev, [name]: value }));
    }

    const handleBusinessChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newBusinesses = [...member.bussinesses];
        newBusinesses[index][name] = value;
        setMember({ ...member, bussinesses: newBusinesses });
    };

    const handleClientChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newClients = [...member.clients];
        newClients[index][name] = value;
        setMember({ ...member, clients: newClients });
    };

    const addBussiness = () => {
        setMember({
            ...member,
            bussinesses: [
                ...member.bussinesses,
                { bussinessName: "", bussinessLogo: "", website: "", category: "", businessType: "" }
            ]
        });
    }

    const removeBusiness = (index: number) => {
        const newBusinesses = [...member.bussinesses];
        newBusinesses.splice(index, 1);
        setMember({ ...member, bussinesses: newBusinesses });
    }

    const addClient = () => {
        setMember({
            ...member,
            clients: [
                ...member.clients,
                { clientBussinessName: "", clientBussinessLogo: "", clientBussinessCategory: "", clientBussinessLink: "", aboutClientBussiness: "" }
            ]
        });
    }

    const removeClient = (index: number) => {
        const newClients = [...member.clients];
        newClients.splice(index, 1);
        setMember({ ...member, clients: newClients });
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            const response = await fetch(`/api/member/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(member),
            });
            if (response.ok) {
                setMessage("Member updated successfully!");
                setTimeout(() => router.push('/admin/members'), 1500);
            } else {
                setMessage("Failed to update member.");
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-12 font-sans pb-20'>
            <div className='max-w-4xl mx-auto'>
                
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/admin/members" className="text-gray-500 hover:text-gray-800 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </Link>
                            <h1 className='text-3xl font-extrabold text-gray-900'>Edit Member</h1>
                        </div>
                        <p className='text-gray-500 ml-9'>Update details for {member.name || 'this member'}.</p>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-3 ${message.includes('success') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className='bg-white shadow-sm border border-gray-100 rounded-2xl p-8'>
                    <form onSubmit={submitHandler} className='space-y-8'>
                        
                        {/* Personal Info */}
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2'>Personal Info</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                                    <input type="text" name="name" value={member.name || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' required />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
                                    <input type="email" name="email" value={member.email || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                                    <input type="text" name="phone" value={member.phone || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Post Name / Title</label>
                                    <input type="text" name="postName" value={member.postName || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Assign Powerteam</label>
                                    <select name="classId" value={member.classId || ""} onChange={handleInputChange as any} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white'>
                                        <option value="">No Powerteam</option>
                                        {classes.map(cls => (
                                            <option key={cls.classId} value={cls.classId}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                                    <input type="text" name="address" value={member.address || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Profile Image URL</label>
                                    <input type="text" name="profileImageUrl" value={member.profileImageUrl || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2'>Professional Details</h3>
                            <div className='grid grid-cols-1 gap-5'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>USP</label>
                                    <textarea name="usp" rows={2} value={member.usp || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>What We Do</label>
                                    <textarea name="whatWeDo" rows={3} value={member.whatWeDo || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Instagram URL</label>
                                    <input type="text" name="instagramUrl" value={member.instagramUrl || ''} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' />
                                </div>
                            </div>
                        </div>

                        {/* Businesses */}
                        <div>
                            <div className='flex items-center justify-between mb-4 border-b pb-2'>
                                <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider'>Businesses / Brands</h3>
                                <button type="button" onClick={addBussiness} className='text-xs font-bold text-blue-600 hover:text-blue-800 transition'>+ ADD BRAND</button>
                            </div>
                            <div className='space-y-4'>
                                {member.bussinesses.map((business, index)=>(
                                    <div key={index} className='bg-gray-50 border border-gray-200 rounded-xl p-5 relative'>
                                        <button type="button" onClick={() => removeBusiness(index)} className='absolute top-3 right-4 text-xs font-bold text-red-500 hover:text-red-700'>Remove</button>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Brand Name</label>
                                                <input type="text" name="bussinessName" value={business.bussinessName || ''} onChange={(e) => handleBusinessChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Category</label>
                                                <input type="text" name="category" value={business.category || ''} onChange={(e) => handleBusinessChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Website</label>
                                                <input type="text" name="website" value={business.website || ''} onChange={(e) => handleBusinessChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Logo URL</label>
                                                <input type="text" name="bussinessLogo" value={business.bussinessLogo || ''} onChange={(e) => handleBusinessChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Business Type</label>
                                                <input type="text" name="businessType" value={business.businessType || ''} onChange={(e) => handleBusinessChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' placeholder='e.g., B2B, B2C, D2C' />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Clients */}
                        <div>
                            <div className='flex items-center justify-between mb-4 border-b pb-2'>
                                <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider'>Clients</h3>
                                <button type="button" onClick={addClient} className='text-xs font-bold text-blue-600 hover:text-blue-800 transition'>+ ADD CLIENT</button>
                            </div>
                            <div className='space-y-4'>
                                {member.clients.map((client, index)=>(
                                    <div key={index} className='bg-gray-50 border border-gray-200 rounded-xl p-5 relative'>
                                        <button type="button" onClick={() => removeClient(index)} className='absolute top-3 right-4 text-xs font-bold text-red-500 hover:text-red-700'>Remove</button>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Client Name</label>
                                                <input type="text" name="clientBussinessName" value={client.clientBussinessName || ''} onChange={(e) => handleClientChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Category</label>
                                                <input type="text" name="clientBussinessCategory" value={client.clientBussinessCategory || ''} onChange={(e) => handleClientChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Logo URL</label>
                                                <input type="text" name="clientBussinessLogo" value={client.clientBussinessLogo || ''} onChange={(e) => handleClientChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Client Link</label>
                                                <input type="text" name="clientBussinessLink" value={client.clientBussinessLink || ''} onChange={(e) => handleClientChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>About Client Business</label>
                                                <input type="text" name="aboutClientBussiness" value={client.aboutClientBussiness || ''} onChange={(e) => handleClientChange(index, e)} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='pt-6 border-t'>
                            <button type="submit" disabled={saving} className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-md flex justify-center items-center gap-2 ${saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
