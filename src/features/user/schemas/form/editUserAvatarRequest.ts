import { z } from "zod";
import { userSchema } from "../userSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const editUserAvatarRequest = userSchema.pick({ avatar: true, avatarColor: true });
export type EditUserAvatarRequest = z.infer<typeof editUserAvatarRequest>;

export const useEditUserAvatarFormProps = (defaultValues: EditUserAvatarRequest) => ({
    defaultValues,
    resolver: zodResolver(editUserAvatarRequest)
});