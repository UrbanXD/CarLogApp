import { StyleSheet } from "react-native";
import { theme } from "./theme";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ControllerFieldState, ControllerRenderProps, UseFormHandleSubmit, UseFormStateReturn } from "react-hook-form";
import { InputPickerDataType } from "../features/Form/components/Input/picker/InputPicker";

export interface ControllerRenderArgs {
    field: ControllerRenderProps<any, string>
    fieldState: ControllerFieldState
    formState: UseFormStateReturn<any>
}

export const CAR_NAME_LENGTH = 10;
export const SIMPLE_HEADER_HEIGHT = hp(6.75);
export const SIMPLE_TABBAR_HEIGHT = hp(7.5);
export const ICON_FONT_SIZE_SCALE = 1.5;

export const LOCAL_STORAGE_KEYS = {
    selectedCarIndex: "selectedCarIndex",
    notConfirmedUser: "notConfirmedUser",
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
    upArrowHead: "chevron-up",
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
    search: "magnify",
    addImage: "image-plus",
    image: "image-outline",
    trashCan: "delete-outline",
    calendar: "calendar-range-outline",
    reset: "refresh",
    upload: "upload-outline",
    fuel: "gas-station-outline",
    fuelTank: "propane-tank-outline",
    settings: "cog-outline",
    signOut: "logout"
}

export const ICON_COLORS = {
    default: theme.colors.white,
    good: theme.colors.greenLight,
    wrong: "red",
    active: theme.colors.white,
    inactive: theme.colors.gray1
}

export const FONT_SIZES = {
    p4: hp(1.75),
    p3: hp(2),
    p2: hp(2.25),
    p1: hp(2.75),
    h3: hp(3),
    h2: hp(3.5),
    h1: hp(5),
    title: wp(21.5)
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
        paddingBottom: 5,
        backgroundColor: theme.colors.black2
    },
    scrollViewContentContainer: {
        flexGrow: 1,
        gap: SEPARATOR_SIZES.normal,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        gap: SEPARATOR_SIZES.mediumSmall
    },
    formLinkText: {
        fontSize: FONT_SIZES.p3,
        paddingLeft: SEPARATOR_SIZES.small,
        fontFamily: "Gilroy-Medium",
        color: theme.colors.fuelYellow
    },
    contentContainer: {
        gap: SEPARATOR_SIZES.small,
        flexDirection: "column",
        // marginTop: SEPARATOR_SIZES.mediumSmall,
        paddingVertical: DEFAULT_SEPARATOR,
        paddingHorizontal: DEFAULT_SEPARATOR,
        marginHorizontal: DEFAULT_SEPARATOR,
        backgroundColor: theme.colors.black4,
        borderRadius: 35
    },
    containerTitleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        letterSpacing: FONT_SIZES.p1 * 0.05,
        color: theme.colors.white,
    },
    containerText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
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

export const COLLAPSIBLE_HEADER_HEIGHT = 180;
export const COLLAPSIBLE_HEADER_IMAGE = 110;

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