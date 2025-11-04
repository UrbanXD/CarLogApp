import { z } from "zod";

export const serviceTypeSchema = z
.object({
    id: z.string().uuid(),
    key: z.string(),
    icon: z.string().nullable(),
    primaryColor: z.string().nullable(),
    secondaryColor: z.string().nullable(),
    ownerId: z.string().uuid().nullable() // when null it means its global
});

export type ServiceType = z.infer<typeof serviceTypeSchema>;