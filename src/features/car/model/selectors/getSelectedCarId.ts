import { RootState } from "../../../../database/redux";

export const getSelectedCarId = (state: RootState): string | null => state.cars.selectedCarId;