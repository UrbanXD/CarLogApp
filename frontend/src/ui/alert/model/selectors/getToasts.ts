import { RootState } from "../../../../database/redux/index.ts";
import { Toast } from "../types/index.ts";

export const getToasts = (state: RootState): Array<Toast> => state.alert.toasts;