import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ControllerFieldState, ControllerRenderProps, UseFormStateReturn } from "react-hook-form";

export * from "./baseConfig.ts";
export * from "./colors.ts";
export * from "./icons.ts";
export * from "./fontSizes.ts";
export * from "../ui/alert/constants/index.ts";
export * from "./separatorSizes.ts";
export * from "./globalStyles.ts";

export interface ControllerRenderArgs {
    field: ControllerRenderProps<any, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<any>;
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
    const cars_data = {} as CarBrandsType;

    CARS_DATA.forEach((item: any) => {
        const models = [] as Array<CarModelsType>;

        item
        .models
        .map((item: any) => {
            models.push({
                name: item.name,
                startYear: Number(item.years.startYear),
                endYear: Number(item.years.endYear)
            });
        });

        cars_data[item.brand] = models;
    });
    return cars_data;
};

export const CARS = GET_CARS();