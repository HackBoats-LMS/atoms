import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCachedSettings } from "@/lib/settings";

export async function GET(request: NextRequest) {
    try {
        const settings = await getCachedSettings();

        return NextResponse.json({ success: true, settings }, { status: 200 });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.appName || data.appName.trim() === "") {
            return NextResponse.json({ success: false, message: "App name is required" }, { status: 400 });
        }

        const settings = await prisma.settings.upsert({
            where: { id: "global" },
            update: {
                appName: data.appName.trim()
            },
            create: {
                id: "global",
                appName: data.appName.trim()
            }
        });

        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true, message: "Settings updated successfully", settings }, { status: 200 });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
