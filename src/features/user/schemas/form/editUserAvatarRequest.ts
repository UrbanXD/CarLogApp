import { z } from "zod";
import { userSchema } from "../userSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { zImage } from "../../../../types/zodTypes.ts";

const editUserAvatarRequest = userSchema
.pick({ avatarColor: true })
.extend({
    avatar: zImage.optional().nullable(),
    isImageAvatar: z.boolean().default(false)
});
export type EditUserAvatarRequest = z.infer<typeof editUserAvatarRequest>;

export const useEditUserAvatarFormProps = (defaultValues: EditUserAvatarRequest) => ({
    defaultValues,
    resolver: zodResolver(editUserAvatarRequest)
});