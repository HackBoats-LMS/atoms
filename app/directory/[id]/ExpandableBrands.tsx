"use client"
import { useState } from 'react'

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

export default function ExpandableBrands({ businesses }: { businesses: any[] }) {
    const [expanded, setExpanded] = useState(false);
    
    const visibleBusinesses = expanded ? businesses : businesses.slice(0, 2);

    if (businesses.length === 0) return null;

    return (
        <div>
            <h4 className="text-[15px] font-bold text-gray-900 mb-4">Brands we handle:</h4>
            <div className="space-y-4">
            {visibleBusinesses.map((b: any) => (
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
                    #{b.category?.replace(/\s+/g, '') || "Brand"}
                    </span>
                </div>
                </div>
            ))}
            </div>
            {businesses.length > 2 && (
            <div className="text-center mt-5">
                <button 
                  onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }} 
                  className="text-xs font-bold text-gray-900 underline underline-offset-4 cursor-pointer hover:text-gray-600 transition"
                >
                  {expanded ? "Show less" : "Click here to view all my Brands we handle"}
                </button>
            </div>
            )}
        </div>
    );
}
