import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ControllerFieldState, ControllerRenderProps, UseFormStateReturn } from "react-hook-form";
import { InputPickerDataType } from "../components/Input/picker/InputPicker";

export * from "./Colors.ts";
export * from "./Icons.ts";
export * from "./FontSizes.ts";
export * from "../ui/alert/constants/index.ts";
export * from "./SeparatorSizes.ts";
export * from "./GlobalStyles.ts";

export interface ControllerRenderArgs {
    field: ControllerRenderProps<any, string>
    fieldState: ControllerFieldState
    formState: UseFormStateReturn<any>
}

export const SIMPLE_HEADER_HEIGHT = hp(6.75);
export const SIMPLE_TABBAR_HEIGHT = hp(7.5);
export const ICON_FONT_SIZE_SCALE = 1.5;

export interface CarBrandsType {
    [key: string]: Array<CarModelsType>;
}

export interface CarModelsType {
    name: string,
    startYear: number,
    endYear: number,
}

export const CARS_DATA = require("../assets/cars.json");

export const GET_CARS = () => {
    const cars_data = { } as CarBrandsType;

    CARS_DATA.forEach((item: any) => {
        const models = [] as Array<CarModelsType>;

        item
            .models
            .map((item: any) => {
                models.push({
                    name: item.name,
                    startYear: Number(item.years.startYear),
                    endYear: Number(item.years.endYear)
                })
            })

        cars_data[item.brand] = models;
    })
    return cars_data;
}

export const CARS = GET_CARS();

export const DATA_TRANSFORM_TO_PICKER_DATA = (data: any, titleSelector?: string, subtitleSelector?: string, valueSelector?: string) => {
    const picker_data = [] as Array<InputPickerDataType>;

    data
        .map((item: any) => {
            picker_data.push({
                title: titleSelector ? item[titleSelector] : item,
                subtitle: subtitleSelector && item[subtitleSelector],
                value: valueSelector && item[valueSelector]
            })
        })
    return picker_data;
}