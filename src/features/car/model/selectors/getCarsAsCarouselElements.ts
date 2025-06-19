import { RootState } from "../../../../database/redux/index.ts";
import { createSelector } from "@reduxjs/toolkit";
import { PickerDataType } from "../../../../components/Input/picker/Picker.tsx";

export const getCarsAsCarouselElements = () => createSelector(
    [(state: RootState) => state.cars.cars],
    (cars): Array<PickerDataType> => cars.map(car => ({
        id: car.id,
        title: car.name,
        subtitle: `${ car.brand }, ${ car.model }`
    }))
);