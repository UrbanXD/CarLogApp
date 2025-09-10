import { z } from "zod";
import { userSchema } from "../userSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const changeEmailRequest = userSchema.pick({ email: true });
export type ChangeEmailRequest = z.infer<typeof changeEmailRequest>;

export const useChangeEmailFormProps = (defaultValues: ChangeEmailRequest) => ({
    defaultValues,
    resolver: zodResolver(changeEmailRequest)
});