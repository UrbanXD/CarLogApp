import { modelSchema } from "./modelSchema.ts";
import { makeSchema } from "./makeSchema.ts";
import { z } from "zod";

export const carModelSchema = modelSchema
.pick({ id: true, name: true })
.extend({ make: makeSchema, year: modelSchema.shape.startYear });

export type CarModel = z.infer<typeof carModelSchema>;