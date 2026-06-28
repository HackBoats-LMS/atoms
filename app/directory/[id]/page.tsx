import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhoneIcon, MailIcon, GlobeIcon, LinkedInIcon, InstagramIcon, WhatsAppIcon } from "../Icons";

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

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const member = await prisma.member.findUnique({
    where: { memberId: id },
    include: {
      businesses: true,
      clients: true,
    }
  });

  if (!member) {
    return notFound();
  }

  const business = member.businesses[0]; 
  const clients = member.clients;

  return (
    <div className="min-h-screen bg-[#e5e5e5] p-4 sm:p-8 flex flex-col items-center font-sans pb-20">
      <div className="w-full max-w-[500px] md:max-w-3xl lg:max-w-4xl bg-white rounded-[32px] shadow-sm relative overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 sm:p-10 pb-6 relative">
          <div className="absolute top-8 right-8 z-10">
            <Link href="/directory" className="text-sm font-bold text-gray-900 underline underline-offset-4 hover:text-gray-600 transition tracking-tight">
              &lt;BACK
            </Link>
          </div>

          <div className="flex gap-5 items-center">
            {/* Avatar Container */}
            <div className="relative w-[100px] h-[100px] flex-shrink-0">
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
                 <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full p-[3px] shadow-md z-10 translate-x-1/4 translate-y-1/4">
                   <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                     <img src={getImageUrl(business.bussinessLogo)} className="w-full h-full object-contain" alt="Logo" />
                   </div>
                 </div>
              )}
            </div>
            
            {/* Title */}
            <div className="flex-1 mr-12">
              <h1 className="text-[26px] font-bold text-gray-900 leading-tight">{member.name}</h1>
              <p className="text-gray-500 text-[14px] mt-1 leading-snug">{business?.category || "Member"}</p>
            </div>
          </div>
        </div>

        <div className="px-8 sm:px-10 pb-10 space-y-7">
          
          {/* Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Phone:</h4>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-5 flex justify-center"><PhoneIcon className="w-5 h-5 text-gray-400" /></div>
                <span>{member.phone || 'N/A'}</span>
              </div>
            </div>
            
            {business?.website && !['Nill', 'N/A', 'NIL', 'na', '-', '.'].includes(business.website.trim()) && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Website:</h4>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 flex justify-center"><GlobeIcon className="w-4 h-4 text-gray-400" /></div>
                  <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                    {business.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Email:</h4>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-5 flex justify-center"><MailIcon className="w-5 h-5 text-gray-400" /></div>
                <span className="truncate" title={member.email}>{member.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Social Links:</h4>
            <div className="flex items-center gap-4">
              {member.instagramUrl && !['Nill', 'N/A', 'NIL', 'na', '-', '.'].includes(member.instagramUrl.trim()) ? (
                <a href={member.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white hover:opacity-80 transition shadow-sm">
                  <InstagramIcon className="w-5 h-5" />
                </a>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition shadow-sm">
                  <InstagramIcon className="w-5 h-5" />
                </div>
              )}
              {member.phone ? (
                <a href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-80 transition shadow-sm">
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition shadow-sm">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-[15px] font-bold text-gray-900 mb-3">Address:</h4>
            <p className="text-[#333333] text-[15px] leading-relaxed whitespace-pre-wrap pr-4">
              {member.address || 'N/A'}
            </p>
          </div>

          {/* USP */}
          {member.usp && (
            <div>
              <h4 className="text-[15px] font-bold text-gray-900 mb-3">Unique Selling Proposition:</h4>
              <div className="bg-[#f7f7f7] rounded-[16px] p-5 text-[#333333] text-[14px] leading-relaxed">
                {member.usp}
              </div>
            </div>
          )}

          {/* What we do */}
          {member.whatWeDo && (
            <div>
              <h4 className="text-[15px] font-bold text-gray-900 mb-3">What we do</h4>
              <div className="bg-[#f7f7f7] rounded-[16px] p-5 text-[#333333] text-[14px] leading-relaxed">
                {member.whatWeDo}
              </div>
            </div>
          )}

          {/* Brands we handle */}
          {member.businesses.length > 0 && (
            <div>
              <h4 className="text-[15px] font-bold text-gray-900 mb-4">Brands we handle:</h4>
              <div className="space-y-4">
                {member.businesses.map(b => (
                  <div key={b.bussinessId} className="bg-[#f7f7f7] rounded-[16px] p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {b.bussinessLogo ? (
                      <div className="w-[50px] h-[50px] bg-white rounded-full p-2 shadow-sm flex-shrink-0 flex items-center justify-center">
                        <img src={getImageUrl(b.bussinessLogo)} className="w-full h-full object-contain" alt={b.bussinessName} />
                      </div>
                    ) : (
                      <div className="w-[50px] h-[50px] bg-white rounded-full p-2 shadow-sm flex items-center justify-center text-xl font-bold text-gray-400 flex-shrink-0">
                        {b.bussinessName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h5 className="text-gray-900 font-bold text-[15px]">{b.bussinessName}</h5>
                      <span className="inline-block mt-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full text-[11px] font-bold text-gray-600 shadow-sm">
                        #{b.category.replace(/\s+/g, '') || "Brand"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-5">
                <a href="#" className="text-xs font-bold text-gray-900 underline underline-offset-4">Click here to view all my Brands we handle</a>
              </div>
            </div>
          )}

          {/* Clients List */}
          {clients.length > 0 && (
            <div>
              <h4 className="text-[15px] font-bold text-gray-900 mb-4">Our Clients List:</h4>
              <div className="space-y-4">
                {clients.map(client => (
                  <div key={client.clientId} className="bg-[#f7f7f7] rounded-[16px] p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-[50px] h-[50px] bg-white rounded-full p-2 shadow-sm flex items-center justify-center flex-shrink-0">
                       <span className="text-[10px] font-bold text-indigo-600 truncate px-1 w-full text-center">
                         {client.clientBussinessName.substring(0,6)}
                       </span>
                    </div>
                    <div>
                      <h5 className="text-gray-900 font-bold text-[15px]">{client.clientBussinessName}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
