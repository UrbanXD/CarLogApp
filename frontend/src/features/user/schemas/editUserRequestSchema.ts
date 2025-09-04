import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, userSchema } from "./userSchema.tsx";

const editUserRequestSchema = userSchema.partial();
export type EditUserRequest = z.infer<typeof editUserRequestSchema>;

export const useEditUserFormProps = (user: User) => {
    return {
        defaultValues: user,
        resolver: zodResolver(editUserFormSchema)
    };
};