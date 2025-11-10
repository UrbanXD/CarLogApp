import { ImageSource } from "../../../types/index.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import { router } from "expo-router";

export type Action = {
    icon: ImageSource
    label: string
    onPress: () => void
}

export const ACTIONS: Array<Action> = [
    { icon: ICON_NAMES.car, label: "Autó létrehozás", onPress: () => router.push("bottomSheet/createCar") },
    { icon: ICON_NAMES.serviceOutline, label: "Szervizelés", onPress: () => router.push("expense/create/service") },
    { icon: ICON_NAMES.fuelPump, label: "Tankolás", onPress: () => router.push("expense/create/fuel") },
    { icon: ICON_NAMES.receipt, label: "Egyéb kiadások", onPress: () => router.push("expense/create") },
    { icon: ICON_NAMES.road, label: "Út tervezés", onPress: () => router.push("ride/create") },
    {
        icon: ICON_NAMES.odometer,
        label: "Kilóméteróra-állás frissítés",
        onPress: () => router.push("odometer/log/create")
    }
];