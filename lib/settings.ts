import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCachedSettings = unstable_cache(
    async () => {
        let settings = await prisma.settings.findUnique({
            where: { id: "global" }
        });

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    id: "global",
                    appName: "Atoms",
                }
            });
        }
        return settings;
    },
    ['global-settings'],
    { tags: ['settings'] }
);
