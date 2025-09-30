import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { OdometerLog } from "../features/car/schemas/odometerLogSchema.ts";
import { useDatabase } from "../contexts/database/DatabaseContext.ts";
import { Car } from "../features/car/schemas/carSchema.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import Divider from "../components/Divider.tsx";
import { InfoRow } from "../components/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../constants/index.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAlert } from "../ui/alert/hooks/useAlert.ts";
import { DeleteOdometerLogToast } from "../features/car/presets/toast/DeleteOdometerLogToast.ts";
import Button from "../components/Button/Button.ts";

const DIVIDER_COLOR = COLORS.gray3;
const DIVIDER_MARGIN = SEPARATOR_SIZES.lightSmall / 3;

export function OdometerLogScreen() {
    const { id } = useLocalSearchParams();
    const { odometerDao, carDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const { bottom } = useSafeAreaInsets();

    const [car, setCar] = useState<Car | null>(null);
    const [odometerLog, setOdometerLog] = useState<OdometerLog | null>(null);

    useEffect(() => {
        const getOdometerLog = async () => {
            setOdometerLog(await odometerDao.getOdometerLogById(id) ?? null);
        };

        getOdometerLog();
    }, [id]);

    useEffect(() => {
        if(car?.id === odometerLog?.carId || !odometerLog?.carId) return;

        const getCar = async () => {
            setCar(await carDao.getCar(odometerLog.carId));
        };

        getCar();
    }, [odometerLog]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await odometerDao.deleteOdometerLog(id);
            openToast(DeleteOdometerLogToast.success());

            if(router.canGoBack()) return router.back();
            router.replace("/odometer/log");
        } catch(_) {
            openToast(DeleteOdometerLogToast.error());
        }
    }, [odometerDao]);

    const onDelete = useCallback(() => {
        console.log("feslkn ksefn lnslgn");
        if(!odometerLog) return openToast({ type: "warning", title: "Napló bejegyzés nem található!" });

        openModal({
            title: `Kilométeróra-állás napló bejegyzés  törlése`,
            body: `A törlés egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            acceptAction: () => handleDelete(odometerLog.id)
        });
    }, [odometerLog, openToast, openModal, odometerDao]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <InfoRow
                    icon={ ICON_NAMES.car }
                    title={ car?.name }
                    subtitle={ `${ car?.model.make.name } ${ car?.model.name }` }
                />
                <Divider color={ DIVIDER_COLOR } margin={ DIVIDER_MARGIN }/>
                <InfoRow
                    icon={ ICON_NAMES.odometer }
                    title={ "Kilométeróra-állás" }
                    subtitle={ `${ odometerLog?.value } ${ odometerLog?.unit }` }
                />
                <Divider color={ DIVIDER_COLOR } margin={ DIVIDER_MARGIN }/>
                <InfoRow
                    icon={ ICON_NAMES.note }
                    subtitle={ odometerLog?.note ?? "Nincs megjegyzés" }
                    subtitleStyle={ !odometerLog?.note && { color: COLORS.gray2 } }
                />
            </ScreenScrollView>
            <Button.EditDelete
                buttonContainerStyle={ { paddingBottom: bottom + SEPARATOR_SIZES.lightSmall } }
                onDeletePress={ onDelete }
                onEditPress={ () => {} }
            />
        </>
    );
}