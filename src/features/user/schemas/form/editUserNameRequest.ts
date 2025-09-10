import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../userSchema.ts";

const editUserNameRequest = userSchema.pick({ firstname: true, lastname: true });
export type EditUserNameRequest = z.infer<typeof editUserNameRequest>;

export const useEditUserNameFormProps = (defaultValues: EditUserNameRequest) => ({
    defaultValues,
    resolver: zodResolver(editUserNameRequest)
});