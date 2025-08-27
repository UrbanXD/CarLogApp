import { RootState } from "../../../../database/redux/index.ts";

export const isLoading = (state: RootState): boolean => state.cars.loading;