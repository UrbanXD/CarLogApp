import { StyleSheet } from "react-native";
import { theme } from "./theme";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { UseFormHandleSubmit } from "react-hook-form";
import { SupabaseConnector } from "../utils/database/SupabaseConnector";
import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../utils/database/AppSchema";
import { InputPickerDataType } from "../components/input/InputPicker/InputPicker";

export interface GetFormHandleSubmitArgs {
    handleSubmit: UseFormHandleSubmit<any>
    supabaseConnector?: SupabaseConnector
    db?: Kysely<DatabaseType>
    onSubmit?: (isSuccess: boolean) => void
}


export const CAR_NAME_LENGTH = 10

export const LOCAL_STORAGE_KEYS = {
    selectedCarIndex: "selectedCarIndex"
}

export const ICON_NAMES = {
    close: "close",
    email: "email-outline",
    password: "lock-outline",
    user: "account-outline",
    checkMark: "check-circle-outline",
    eye: "eye-outline",
    eyeOff: "eye-off-outline",
    pencil: "pencil-outline",
    rightArrowHead: "chevron-right",
    rightArrow: "arrow-right",
    leftArrowHead: "chevron-left",
    leftArrow: "arrow-left",
    downArrowHead: "chevron-down",
    info: "information-outline",
    destinationPointMarker: "map-marker",
    startingPointMarker: "map-marker-outline",
    clock: "clock-time-seven-outline",
    homeOutline: "home-outline",
    home: "home",
    notebookOutline: "notebook-outline",
    notebook: "notebook",
    serviceOutline: "wrench-outline",
    service: "wrench",
    expensesOutline: "account-cash-outline",
    expenses: "account-cash",
    car: "car-outline",
    nametag: "tag-text-outline",
    odometer: "gauge",
    search: "magnify"
}

export const ICON_COLORS = {
    default: theme.colors.white,
    good: theme.colors.greenLight,
    wrong: "red",
    active: theme.colors.white,
    inactive: theme.colors.gray1
}

export const FONT_SIZES = {
    extraSmall: hp(2),
    small: hp(2.25),
    normal: hp(3),//2.5
    medium: hp(3.5),
    large: hp(5),
    extraLarge: wp(22)
}

export const SEPARATOR_SIZES = {
    lightSmall: hp(1),
    small: hp(1.5),
    mediumSmall: hp(1.75),
    normal: hp(2.5),
    medium: hp(3),
    extraMedium: hp(5),
    lightLarge: hp(7.5),
    large: hp(8.5)
}

export const DEFAULT_SEPARATOR = SEPARATOR_SIZES.normal

export const GLOBAL_STYLE = StyleSheet.create({
    pageContainer: {
        flex: 1,
        // paddingHorizontal: DEFAULT_SEPARATOR,
        paddingVertical: SEPARATOR_SIZES.small,
    },
    scrollViewContentContainer: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        gap: SEPARATOR_SIZES.mediumSmall
    },
    formLinkText: {
        fontSize: FONT_SIZES.extraSmall,
        paddingLeft: SEPARATOR_SIZES.small,
        fontFamily: "Gilroy-Medium",
        color: theme.colors.fuelYellow
    },
    contentContainer: {
        gap: SEPARATOR_SIZES.small,
        flexDirection: "column",
        marginTop: SEPARATOR_SIZES.mediumSmall,
        paddingHorizontal: DEFAULT_SEPARATOR,
        marginHorizontal: DEFAULT_SEPARATOR,
        backgroundColor: theme.colors.black4,
        padding: 20,
        borderRadius: 35
    },
    containerTitleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.normal,
        letterSpacing: FONT_SIZES.normal * 0.05,
        color: theme.colors.white,
    },
    containerText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        lineHeight: FONT_SIZES.small * 1.2,
        letterSpacing: FONT_SIZES.small * 0.035,
        color: theme.colors.gray1,
    },
    rowContainer: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        height: hp(8.5),
        backgroundColor: theme.colors.black2,
        borderRadius: 15,
        padding: SEPARATOR_SIZES.small
    },
    columnContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});

export const GET_ICON_BUTTON_RESET_STYLE = (size: number = FONT_SIZES.normal) => {
    return { width: size, height: size, margin: 0 }
}

export const COLLAPSIBLE_HEADER_HEIGHT = 180;
export const COLLAPSIBLE_HEADER_IMAGE = 110;

export const SIMPLE_HEADER_HEIGHT = hp(6.75);
export const SIMPLE_TABBAR_HEIGHT = hp(6.75);

export interface CarBrandsType {
    [key: string]: Array<CarModelsType>;
}

export interface CarModelsType {
    name: string,
    startYear: number,
    endYear: number,
}

export const CARS_DATA = require("../../../assets/cars.json");

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