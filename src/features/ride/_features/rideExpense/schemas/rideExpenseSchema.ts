import { z } from "zod";
import { userSchema } from "../../../../user/schemas/userSchema.ts";
import { rideLogSchema } from "../../../schemas/rideLogSchema.ts";
import { expenseSchema } from "../../../../expense/schemas/expenseSchema.ts";

export const rideExpenseSchema = z.object({
    id: z.string().uuid(),
    ownerId: userSchema.shape.id,
    rideLogId: z.lazy(() => rideLogSchema.shape.id),
    expense: expenseSchema
});

export const formResultRideExpenseSchema = rideExpenseSchema.omit({ ownerId: true, rideLogId: true });

export type RideExpense = z.infer<typeof rideExpenseSchema>;
export type FormResultRideExpense = z.infer<typeof formResultRideExpenseSchema>;