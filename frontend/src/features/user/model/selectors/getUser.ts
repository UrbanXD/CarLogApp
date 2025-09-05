import { RootState } from "../../../../database/redux/index.ts";
import { User } from "../../schemas/userSchema.tsx";

export const getUser = (state: RootState): User | null => state.user.user;