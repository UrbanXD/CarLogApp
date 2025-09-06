import { z } from "zod";
import { userSchema } from "./userSchema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";

const editUserNameRequest = userSchema.pick({ firstname: true, lastname: true });
export type EditUserNameRequest = z.infer<typeof editUserNameRequest>;

export const useEditUserNameFormProps = (defaultValues: EditUserNameRequest) => ({
    defaultValues,
    resolver: zodResolver(editUserNameRequest)
});