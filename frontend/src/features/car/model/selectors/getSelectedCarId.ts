import { RootState } from "../../../../database/redux/index.ts";

export const getSelectedCarId = (state: RootState): string => state.cars.selectedCarID;