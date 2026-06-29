"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PhoneIcon, MailIcon, GlobeIcon, InstagramIcon, WhatsAppIcon, ArrowRightIcon } from "./Icons";

// Helper function to render Google Drive images correctly using the thumbnail API
function getImageUrl(url: string | null | undefined) {
  if (!url) return '';
  let id = '';
  if (url.includes('drive.google.com/open?id=')) {
    id = url.split('open?id=')[1]?.split('&')[0];
  } else if (url.includes('drive.google.com/file/d/')) {
     const match = url.match(/\/d\/(.+?)\//);
     if (match && match[1]) id = match[1];
  }
  
  if (id) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w400-h400`;
  }
  return url;
}

export default function DirectoryClient({ members, classes = [] }: { members: any[], classes?: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set<string>();
    members.forEach(member => {
      const category = member.businesses?.[0]?.category;
      if (category) cats.add(category.trim());
    });
    return Array.from(cats).sort();
  }, [members]);


  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const business = member.businesses?.[0];
      const memberCategory = business?.category?.trim() || "";
      
      // Class filter
      if (selectedClass && member.classId !== selectedClass) {
        return false;
      }

      // Category filter
      if (selectedCategory && memberCategory !== selectedCategory) {
        return false;
      }
      

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const nameMatch = member.name.toLowerCase().includes(search);
        const businessMatch = business?.bussinessName?.toLowerCase().includes(search);
        const whatWeDoMatch = member.whatWeDo?.toLowerCase().includes(search);
        const categoryMatch = business?.category?.toLowerCase().includes(search);
        
        if (!nameMatch && !businessMatch && !whatWeDoMatch && !categoryMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [members, searchTerm, selectedCategory, selectedClass]);

  return (
    <div className="w-full max-w-[1400px]">
      
      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="w-full lg:w-1/3 relative">
          <input 
            type="text"
            placeholder="Search by name, business, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <div className="w-full sm:w-auto sm:min-w-[180px] relative">
            <select 
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedCategory(''); // Reset category when class changes
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 bg-white cursor-pointer appearance-none pr-10"
            >
              <option value="">All Powerteams</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>{cls.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[180px] relative">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 bg-white cursor-pointer appearance-none pr-10"
            >
              <option value="">All Categories</option>
              {categories
                .filter(cat => {
                  if (!selectedClass) return true;
                  // If a class is selected, only show categories of members in that class
                  return members.some(m => m.classId === selectedClass && m.businesses?.[0]?.category === cat);
                })
                .map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Row */}
      {(searchTerm || selectedCategory || selectedClass) && (
        <div className="flex flex-wrap gap-2 mb-8 items-center px-2">
          <span className="text-sm text-gray-500 font-medium mr-1">Active Filters:</span>
          
          {searchTerm && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span>Search: &quot;{searchTerm}&quot;</span>
              <button onClick={() => setSearchTerm('')} className="hover:text-blue-900 transition flex items-center justify-center rounded-full hover:bg-blue-200 p-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {selectedClass && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span>Powerteam: {classes.find(c => c.classId === selectedClass)?.name || selectedClass}</span>
              <button onClick={() => setSelectedClass('')} className="hover:text-green-900 transition flex items-center justify-center rounded-full hover:bg-green-200 p-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {selectedCategory && (
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span>Category: {selectedCategory}</span>
              <button onClick={() => setSelectedCategory('')} className="hover:text-purple-900 transition flex items-center justify-center rounded-full hover:bg-purple-200 p-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}


          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSelectedClass(''); }}
            className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4 ml-2 transition"
          >
            Clear all
          </button>
        </div>
      )}
      
      {!searchTerm && !selectedCategory && !selectedClass && <div className="mb-8"></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {filteredMembers.map((member) => {
          const business = member.businesses?.[0]; 
          const clients = member.clients || [];
          
          return (
            <div key={member.memberId} className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col w-full hover:shadow-md transition-shadow">
              
              {/* Header: Avatar & Name */}
              <div className="flex items-center gap-5">
                <div className="relative w-[88px] h-[88px] flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    {member.profileImageUrl ? (
                      <img src={getImageUrl(member.profileImageUrl)} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-semibold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {business?.bussinessLogo && (
                     <div className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full p-[3px] shadow-md z-10 translate-x-1/4 translate-y-1/4">
                       <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                         <img src={getImageUrl(business.bussinessLogo)} className="w-full h-full object-contain border-black border-2" alt="Logo" />
                       </div>
                     </div>
                  )}
                </div>
                <div>
                  <h2 className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-tight">{member.name}</h2>
                  <p className="text-gray-500 text-[13px] sm:text-[15px] mt-1 line-clamp-2 leading-snug">{business?.category || "Member"}</p>
                </div>
              </div>

              {/* Contact Info Grid */}
              {(() => {
                const hasWebsite = !!(business?.website && !['Nill', 'N/A', 'NIL', 'na', '-', '.'].includes(business.website.trim()));
                
                return (
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-8 text-[12px] sm:text-[13px] text-[#333333]">
                    {/* Phone - Always Order 1 */}
                    <div className="flex items-center gap-3 order-1">
                      <div className="w-[18px] flex justify-center"><PhoneIcon className="w-[18px] h-[18px] text-gray-400" /></div>
                      <span className="truncate">{member.phone || 'N/A'}</span>
                    </div>
                    
                    {/* Website - conditionally rendered (Order 2) */}
                    {hasWebsite && (
                      <div className="flex items-center gap-3 order-2">
                        <div className="w-[18px] flex justify-center"><GlobeIcon className="w-[16px] h-[16px] text-gray-400" /></div>
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                          {business.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}

                    {/* Email - Always Order 3 */}
                    <div className="flex items-center gap-3 order-3">
                      <div className="w-[18px] flex justify-center"><MailIcon className="w-[18px] h-[18px] text-gray-400" /></div>
                      <span className="truncate" title={member.email}>{member.email || 'N/A'}</span>
                    </div>
                    
                    {/* Socials - Order 4 if Website exists, Order 2 if it doesn't */}
                    <div className={`flex items-center gap-3 sm:pl-1 ${hasWebsite ? 'order-4' : 'order-2'}`}>
                      {member.instagramUrl && !['Nill', 'N/A', 'NIL', 'na', '-', '.'].includes(member.instagramUrl.trim()) ? (
                        <a href={member.instagramUrl} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white hover:opacity-80 transition shadow-sm">
                          <InstagramIcon className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition shadow-sm">
                          <InstagramIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {member.phone ? (
                        <a href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-80 transition shadow-sm">
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                         <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition shadow-sm">
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* What we do */}
              <div className="bg-[#f7f7f7] rounded-[16px] p-5 mt-7 flex-grow">
                <h3 className="text-[13px] font-extrabold text-gray-900 mb-1.5">What we do</h3>
                <p className="text-[#333333] text-[13px] leading-relaxed line-clamp-4">
                  {member.whatWeDo || 'No description provided.'}
                </p>
              </div>

              {/* Footer: Button & Clients */}
              <div className="flex items-end justify-between mt-6 pt-2 gap-4">
                <Link href={`/directory/${member.memberId}`} prefetch={true} className="flex-1 w-full px-6 py-2.5 bg-[#e5e5e5] hover:bg-[#d4d4d4] text-[#111111] text-[13px] font-bold rounded-full flex items-center justify-center gap-2 transition-colors">
                  View Full Profile
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>

                {clients.length > 0 && (
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[10px] font-extrabold text-gray-900 mb-1 pr-1">Clients</span>
                    <div className="flex -space-x-3">
                      {clients.slice(0, 3).map((client: any, idx: number) => {
                        const colors = ['bg-red-600', 'bg-black', 'bg-blue-600'];
                        return (
                          <div key={client.clientId} className={`w-9 h-9 rounded-full border-2 border-white ${colors[idx % colors.length]} text-white flex items-center justify-center text-[8px] font-bold text-center leading-tight shadow-sm relative group overflow-hidden z-${30 - idx * 10}`}>
                            <span className="truncate w-full px-0.5">{client.clientBussinessName.substring(0,4)}</span>
                          </div>
                        )
                      })}
                      {clients.length > 3 && (
                         <div className="w-9 h-9 rounded-full border-2 border-white bg-white text-gray-900 flex items-center justify-center text-[10px] font-bold shadow-sm z-0 relative">
                           +{clients.length - 3}
                         </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center text-gray-500 py-20 text-lg">
          No members found matching your search.
        </div>
      )}
    </div>
  );
}
