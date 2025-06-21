import { RootState } from "../../../../database/redux/index.ts";

export const isUserLoading = (state: RootState) => state.user.isLoading;