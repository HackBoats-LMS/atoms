import { prisma } from "@/lib/prisma"
import AdminManagerClient from "./AdminManagerClient"

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    // Fetch all current admins to display in the list
    const admins = await prisma.admin.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return <AdminManagerClient initialAdmins={admins} />
}
