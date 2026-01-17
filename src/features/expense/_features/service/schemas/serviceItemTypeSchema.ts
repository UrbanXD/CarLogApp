import { z } from "zod";

export const serviceItemTypeSchema = z
.object({
    id: z.string().uuid(),
    key: z.string(),
    icon: z.string().nullable(),
    primaryColor: z.string(),
    secondaryColor: z.string().nullable(),
    ownerId: z.string().uuid().nullable() // when null it means its global
});

export type ServiceItemType = z.infer<typeof serviceItemTypeSchema>;