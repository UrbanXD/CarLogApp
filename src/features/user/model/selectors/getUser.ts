import { RootState } from "../../../../database/redux/index.ts";
import { UserAccount } from "../../schemas/userSchema.ts";

export const getUser = (state: RootState): UserAccount | null => state.user.user;