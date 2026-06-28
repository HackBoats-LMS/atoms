"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {

    const [member,setMember] = useState({
        name:"",
        email:"",
        phone:"",
        address:"",
        postName:"",
        usp:"",
        whatWeDo:"",
        instagramUrl:"",
        profileImageUrl:"",
        bussinesses: [{
            bussinessName:"",
            bussinessLogo:"",
            website:"",
            category:"",
            businessType:""
        }
        ],
        clients: [
            {
                clientBussinessName:"",
                clientBussinessLogo:"",
                clientBussinessCategory:"",
                clientBussinessLink:"",
                aboutClientBussiness:""
            }
        ]
    })

    const router = useRouter();

    const submitHandeler = async (e: React.FormEvent)=>{
        e.preventDefault();
        const response = await fetch('/api/member/upload',{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(member),
        })
        const data = await response.json();
        console.log(data);
    }
    const addBussiness = () => {
        setMember({
            ...member,
            bussinesses:[
                ...member.bussinesses,
                {
                    bussinessName:"",
                    bussinessLogo:"",
                    website:"",
                    category:"",
                    businessType:""
                }
            ]
        })
    }

    const addClient = () =>{
        setMember({
            ...member,
            clients:[
                ...member.clients,
            {
                clientBussinessName:"",
                clientBussinessLogo:"",
                clientBussinessCategory:"",
                clientBussinessLink:"",
                aboutClientBussiness:""
            }]
        })
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMember(prev => ({ ...prev, [name]: value }));
    }

  return (
    <div className='min-h-screen bg-gray-50 p-6 md:p-12 font-sans'>
        <div className='max-w-7xl mx-auto'>
            <div className='mb-8'>
                <h1 className='text-3xl font-extrabold text-gray-900'>Add New Member</h1>
                <p className='text-gray-500 mt-2'>Add a new member manually.</p>
            </div>

            <div className='flex justify-center'>
                
                {/* Manual Entry Form */}
                <div className='w-full max-w-4xl bg-white shadow-sm border border-gray-100 rounded-2xl p-8'>
                    <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Manual Member Entry
                    </h2>
                    
                    <form onSubmit={submitHandeler} className='space-y-8'>
                        
                        {/* Personal Info */}
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2'>Personal Info</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                                    <input type="text" name="name" value={member.name} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='John Doe' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
                                    <input type="email" name="email" value={member.email} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='john@example.com' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                                    <input type="text" name="phone" value={member.phone} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='+1 234 567 890' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Post Name / Title</label>
                                    <input type="text" name="postName" value={member.postName} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='CEO, Founder' />
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                                    <input type="text" name="address" value={member.address} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='123 Business Rd, City' />
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Profile Image URL (Google Drive ID or Link)</label>
                                    <input type="text" name="profileImageUrl" value={member.profileImageUrl} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='https://drive.google.com/...' />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2'>Professional Details</h3>
                            <div className='grid grid-cols-1 gap-5'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Unique Selling Proposition (USP)</label>
                                    <textarea name="usp" rows={2} value={member.usp} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='What makes you unique?' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>What We Do</label>
                                    <textarea name="whatWeDo" rows={3} value={member.whatWeDo} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='Describe the services...' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Instagram URL</label>
                                    <input type="text" name="instagramUrl" value={member.instagramUrl} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='https://instagram.com/...' />
                                </div>
                            </div>
                        </div>

                        {/* Businesses */}
                        <div>
                            <div className='flex items-center justify-between mb-4 border-b pb-2'>
                                <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider'>Businesses</h3>
                                <button type="button" onClick={addBussiness} className='text-xs font-bold text-blue-600 hover:text-blue-800 transition'>+ ADD BUSINESS</button>
                            </div>
                            <div className='space-y-4'>
                                {member.bussinesses.map((business, index)=>(
                                    <div key={index} className='bg-gray-50 border border-gray-200 rounded-xl p-5 relative'>
                                        <div className='absolute top-3 right-4 text-xs font-bold text-gray-400'>#{index + 1}</div>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Business Name</label>
                                                <input type="text" className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Category</label>
                                                <input type="text" className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Website</label>
                                                <input type="text" className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Logo URL</label>
                                                <input type="text" className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
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
                                        <div className='absolute top-3 right-4 text-xs font-bold text-gray-400'>#{index + 1}</div>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Client Name</label>
                                                <input type="text" className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='pt-4'>
                            <button type="submit" className='w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition shadow-md flex justify-center items-center gap-2'>
                                Save Member
                            </button>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default page