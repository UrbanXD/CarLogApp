import { RootState } from "../../../../database/redux/index.ts";
import { createSelector } from "@reduxjs/toolkit";
import { PickerElement } from "../../../../components/Input/picker/PickerItem.tsx";

export const getCarsAsPickerElements = () => createSelector(
    [(state: RootState) => state.cars.cars],
    (cars): Array<PickerElement> => cars.map(car => ({
        title: car.name,
        subtitle: `${ car.brand }, ${ car.model }`,
        value: car.id
    }))
);