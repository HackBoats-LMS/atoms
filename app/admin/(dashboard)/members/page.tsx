import { prisma } from '@/lib/prisma';
import MembersTable from './MembersTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MembersPage() {
    const members = await prisma.member.findMany({
        orderBy: { name: 'asc' },
        include: {
            businesses: true
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Member Directory</h1>
                        <p className="text-gray-500 mt-2">Manage all registered members in your system.</p>
                    </div>
                    <Link 
                        href="/admin/members/upload" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add / Upload
                    </Link>
                </div>
                
                <MembersTable initialMembers={members} />
            </div>
        </div>
    );
}
