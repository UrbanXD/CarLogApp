import { z } from "zod";

export const odometerLogTypeSchema = z
.object({
    id: z.coerce.number(),
    key: z.string(),
    icon: z.string().nullable(),
    primaryColor: z.string(),
    secondaryColor: z.string().nullable()
});

export type OdometerLogType = z.infer<typeof odometerLogTypeSchema>;