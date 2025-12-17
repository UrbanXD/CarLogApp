import { useTranslation } from "react-i18next";
import { ImageSource } from "../../../types/index.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import { router } from "expo-router";
import { useAlert } from "../../alert/hooks/useAlert.ts";
import useCars from "../../../features/car/hooks/useCars.ts";
import { useCallback } from "react";
import { UserDoesNotHaveCarToast } from "../../alert/presets/toast/index.ts";

export type Action = {
    icon: ImageSource
    label: string
    onPress: () => void
}

export function useActions(): { actions: Array<Action> } {
    const { t } = useTranslation();
    const { cars } = useCars();
    const { openToast } = useAlert();

    const actionOnlyWhenCarAvailable = useCallback((callback: () => void) => {
        if(cars.length === 0) return openToast(UserDoesNotHaveCarToast.info());

        callback();
    }, [cars]);

    const actions: Array<Action> = [
        {
            icon: ICON_NAMES.car,
            label: t("action_menu.create_car"),
            onPress: () => router.push("car/create")
        },
        {
            icon: ICON_NAMES.serviceOutline,
            label: t("action_menu.create_service"),
            onPress: () => actionOnlyWhenCarAvailable(() => router.push("expense/create/service"))
        },
        {
            icon: ICON_NAMES.fuelPump,
            label: t("action_menu.create_fuel_log"),
            onPress: () => actionOnlyWhenCarAvailable(() => router.push("expense/create/fuel"))
        },
        {
            icon: ICON_NAMES.receipt,
            label: t("action_menu.create_expense"),
            onPress: () => actionOnlyWhenCarAvailable(() => router.push("expense/create"))
        },
        {
            icon: ICON_NAMES.road,
            label: t("action_menu.create_ride"),
            onPress: () => actionOnlyWhenCarAvailable(() => router.push("ride/create"))
        },
        {
            icon: ICON_NAMES.odometer,
            label: t("action_menu.create_odometer_log"),
            onPress: () => {
                console.log("faszomat");
                actionOnlyWhenCarAvailable(() => router.push("odometer/log/create"));
            }
        },
        {
            icon: ICON_NAMES.destinationPointMarker,
            label: t("action_menu.places"),
            onPress: () => router.push("ride/place")
        },
        {
            icon: ICON_NAMES.passenger,
            label: t("action_menu.passengers"),
            onPress: () => router.push("ride/passenger")
        }
    ];

    return { actions };
}