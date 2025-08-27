import { RootState } from "../../../../database/redux/index.ts";
import { UserDto } from "../types/user.ts";

export const getUser = (state: RootState): UserDto => state.user.user;