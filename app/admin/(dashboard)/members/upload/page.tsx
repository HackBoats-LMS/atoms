"use client"

import React, { useState, useEffect } from 'react'
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

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [batches, setBatches] = useState<any[]>([]);
    const [deletingBatch, setDeletingBatch] = useState<string | null>(null);
    const router = useRouter();

    const fetchBatches = async () => {
        try {
            const res = await fetch('/api/member/upload/batch');
            if (res.ok) {
                const data = await res.json();
                setBatches(data);
            }
        } catch (error) {
            console.error("Failed to fetch batches");
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const handleDeleteBatch = async (batchId: string) => {
        if (!confirm(`Are you sure you want to delete ALL members from batch ${batchId}? This cannot be undone.`)) return;
        
        setDeletingBatch(batchId);
        try {
            const res = await fetch(`/api/member/upload/batch?batchId=${encodeURIComponent(batchId)}`, {
                method: "DELETE"
            });
            
            if (res.ok) {
                alert("Batch deleted successfully");
                fetchBatches(); // refresh batches
                router.refresh();
            } else {
                alert("Failed to delete batch");
            }
        } catch (error) {
            alert("Error deleting batch");
        } finally {
            setDeletingBatch(null);
        }
    };

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleExcelUpload = async () => {
        if (!file) return;
        setUploading(true);
        setUploadMessage("");
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/member/upload/exel", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setUploadMessage("File uploaded successfully! Check the /directory page to view the members.");
                fetchBatches(); // refresh list
                router.refresh();
            } else {
                setUploadMessage("Upload failed: " + data.message);
            }
        } catch (error) {
            console.error(error);
            setUploadMessage("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

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
                <h1 className='text-3xl font-extrabold text-gray-900'>Member Management</h1>
                <p className='text-gray-500 mt-2'>Add new members manually or bulk upload via Excel.</p>
            </div>

            <div className='flex flex-col lg:flex-row gap-8 items-start'>
                
                {/* Manual Entry Form */}
                <div className='flex-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-8'>
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
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name <span className="text-red-500">*</span></label>
                                    <input required type="text" name="name" value={member.name} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='John Doe' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address <span className="text-red-500">*</span></label>
                                    <input required type="email" name="email" value={member.email} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='john@example.com' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number <span className="text-red-500">*</span></label>
                                    <input required type="text" name="phone" value={member.phone} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='+1 234 567 890' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Post Name / Title <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                                    <input type="text" name="postName" value={member.postName} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='CEO, Founder' />
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Address <span className="text-red-500">*</span></label>
                                    <input required type="text" name="address" value={member.address} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='123 Business Rd, City' />
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Profile Image URL (Google Drive ID or Link) <span className="text-red-500">*</span></label>
                                    <input required type="text" name="profileImageUrl" value={member.profileImageUrl} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='https://drive.google.com/...' />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2'>Professional Details</h3>
                            <div className='grid grid-cols-1 gap-5'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Unique Selling Proposition (USP) <span className="text-red-500">*</span></label>
                                    <textarea required name="usp" rows={2} value={member.usp} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='What makes you unique?' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>What We Do <span className="text-red-500">*</span></label>
                                    <textarea required name="whatWeDo" rows={3} value={member.whatWeDo} onChange={handleInputChange} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900' placeholder='Describe the services...' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Instagram URL <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
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
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Business Name <span className="text-red-500">*</span></label>
                                                <input required type="text" value={business.bussinessName} onChange={(e) => { const newB = [...member.bussinesses]; newB[index].bussinessName = e.target.value; setMember({...member, bussinesses: newB}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Category <span className="text-red-500">*</span></label>
                                                <input required type="text" value={business.category} onChange={(e) => { const newB = [...member.bussinesses]; newB[index].category = e.target.value; setMember({...member, bussinesses: newB}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Website <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                                                <input type="text" value={business.website} onChange={(e) => { const newB = [...member.bussinesses]; newB[index].website = e.target.value; setMember({...member, bussinesses: newB}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Logo URL <span className="text-red-500">*</span></label>
                                                <input required type="text" value={business.bussinessLogo} onChange={(e) => { const newB = [...member.bussinesses]; newB[index].bussinessLogo = e.target.value; setMember({...member, bussinesses: newB}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
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
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Client Name <span className="text-red-500">*</span></label>
                                                <input required type="text" value={client.clientBussinessName} onChange={(e) => { const newC = [...member.clients]; newC[index].clientBussinessName = e.target.value; setMember({...member, clients: newC}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Client Category <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                                                <input type="text" value={client.clientBussinessCategory} onChange={(e) => { const newC = [...member.clients]; newC[index].clientBussinessCategory = e.target.value; setMember({...member, clients: newC}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Client Website Link <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                                                <input type="text" value={client.clientBussinessLink} onChange={(e) => { const newC = [...member.clients]; newC[index].clientBussinessLink = e.target.value; setMember({...member, clients: newC}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>Client Logo URL <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                                                <input type="text" value={client.clientBussinessLogo} onChange={(e) => { const newC = [...member.clients]; newC[index].clientBussinessLogo = e.target.value; setMember({...member, clients: newC}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' />
                                            </div>
                                            <div className='md:col-span-2'>
                                                <label className='block text-xs font-medium text-gray-600 mb-1'>About Client <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                                                <textarea rows={2} value={client.aboutClientBussiness} onChange={(e) => { const newC = [...member.clients]; newC[index].aboutClientBussiness = e.target.value; setMember({...member, clients: newC}); }} className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-900' placeholder='Brief description...' />
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

                {/* Bulk Upload Widget */}
                <div className='w-full lg:w-[400px] shrink-0 sticky top-12'>
                    <div className='bg-white shadow-sm border border-gray-100 rounded-2xl p-8'>
                        <h2 className='text-xl font-bold text-gray-900 mb-2 flex items-center gap-2'>
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Bulk Excel Upload
                        </h2>
                        <p className='text-sm text-gray-500 mb-6'>Upload your BNI.xlsx file to rapidly populate or update the directory.</p>
                        
                        <div className='border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer relative'>
                            <input 
                                type="file" 
                                accept=".xlsx, .xls" 
                                onChange={handleFileChange} 
                                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer' 
                            />
                            <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className='text-sm font-semibold text-gray-700'>
                                {file ? file.name : "Click or drag file to upload"}
                            </p>
                            <p className='text-xs text-gray-400 mt-1'>.xlsx files only</p>
                        </div>

                        <button 
                            onClick={handleExcelUpload}
                            disabled={!file || uploading}
                            className={`w-full mt-6 font-bold py-3.5 rounded-xl transition shadow-sm flex justify-center items-center gap-2 ${!file || uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'}`}
                        >
                            {uploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Uploading...
                                </>
                            ) : 'Upload Excel'}
                        </button>

                        {uploadMessage && (
                            <div className={`mt-5 p-4 rounded-xl text-sm border flex items-start gap-3 ${uploadMessage.includes('failed') || uploadMessage.includes('error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                                {uploadMessage.includes('failed') || uploadMessage.includes('error') ? (
                                     <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                                <div>{uploadMessage}</div>
                            </div>
                        )}
                    </div>

                    {/* Batch Management Widget */}
                    <div className='bg-white shadow-sm border border-gray-100 rounded-2xl p-8 mt-8'>
                        <h2 className='text-xl font-bold text-gray-900 mb-2 flex items-center gap-2'>
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Manage Uploads
                        </h2>
                        <p className='text-sm text-gray-500 mb-6'>Delete old Excel uploads to keep your directory clean.</p>
                        
                        {batches.length === 0 ? (
                            <div className='text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
                                <p className='text-gray-500 text-sm'>No Excel uploads found.</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {batches.map((batch) => (
                                    <div key={batch.uploadBatch} className='flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200'>
                                        <div>
                                            <p className='text-sm font-bold text-gray-900'>{batch.uploadBatch}</p>
                                            <p className='text-xs text-gray-500'>{batch._count._all} members</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteBatch(batch.uploadBatch)}
                                            disabled={deletingBatch === batch.uploadBatch}
                                            className='text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50'
                                        >
                                            {deletingBatch === batch.uploadBatch ? 'Deleting...' : 'Delete Batch'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default page