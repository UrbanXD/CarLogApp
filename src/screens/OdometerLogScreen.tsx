import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useDatabase } from "../contexts/database/DatabaseContext.ts";
import { Car } from "../features/car/schemas/carSchema.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import Divider from "../components/Divider.tsx";
import { InfoRow } from "../components/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../constants/index.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAlert } from "../ui/alert/hooks/useAlert.ts";
import Button from "../components/Button/Button.ts";
import { DeleteOdometerLogToast } from "../features/car/_features/odometer/presets/toast/DeleteOdometerLogToast.ts";
import { OdometerLog } from "../features/car/_features/odometer/schemas/odometerLogSchema.ts";
import dayjs from "dayjs";
import { Title } from "../components/Title.tsx";
import { updateCarOdometer } from "../features/car/model/slice/index.ts";
import { useAppDispatch } from "../hooks/index.ts";
import { convertOdometerValueFromKilometer } from "../features/car/_features/odometer/utils/convertOdometerUnit.ts";
import useCars from "../features/car/hooks/useCars.ts";

const DIVIDER_COLOR = COLORS.gray3;
const DIVIDER_MARGIN = SEPARATOR_SIZES.lightSmall / 3;

export function OdometerLogScreen() {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const { getCar } = useCars();
    const { odometerLogDao, carDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const { bottom } = useSafeAreaInsets();

    const [car, setCar] = useState<Car | null>(null);
    const [odometerLog, setOdometerLog] = useState<OdometerLog | null>(null);

    useFocusEffect(
        useCallback(() => {
            const getOdometerLog = async () => {
                const log = await odometerLogDao.getById(id);
                setOdometerLog(log ?? null);
            };

            getOdometerLog();
        }, [id, odometerLogDao])
    );

    useEffect(() => {
        if(car?.id === odometerLog?.carId || !odometerLog?.carId) return;

        setCar(getCar(odometerLog.carId));
    }, [odometerLog]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            if(!car) throw new Error("Car not found!");

            await odometerLogDao.delete(id);
            const newHighestOdometerValueInKilometer = await odometerLogDao.getOdometerValueInKmByCarId(car.id);
            const convertedOdometerValue = convertOdometerValueFromKilometer(
                newHighestOdometerValueInKilometer,
                car.odometer.unit.conversionFactor
            );

            dispatch(updateCarOdometer({ carId: car.id, value: convertedOdometerValue }));

            openToast(DeleteOdometerLogToast.success());

            if(router.canGoBack()) return router.back();
            router.replace("/odometer/log");
        } catch(e) {
            console.log(e);
            openToast(DeleteOdometerLogToast.error());
        }
    }, [odometerLogDao, car]);

    const onDelete = useCallback(() => {
        if(!odometerLog) return openToast({ type: "warning", title: "Napló bejegyzés nem található!" });

        openModal({
            title: `Kilométeróra-állás napló bejegyzés  törlése`,
            body: `A törlés egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            acceptAction: () => handleDelete(odometerLog.id)
        });
    }, [odometerLog, openToast, openModal]);

    const onEdit = useCallback(() => {
        if(!odometerLog) return openToast({ type: "warning", title: "Napló bejegyzés nem található!" });

        router.push({
            pathname: "/odometer/log/edit/[id]",
            params: { id: odometerLog.id }
        });
    });

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ odometerLog?.type.locale }
                    dividerStyle={ {
                        backgroundColor: odometerLog?.type.primaryColor ?? COLORS.gray2,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
                <InfoRow
                    icon={ ICON_NAMES.car }
                    title={ car?.name }
                    subtitle={ `${ car?.model.make.name } ${ car?.model.name }` }
                />
                <Divider color={ DIVIDER_COLOR } margin={ DIVIDER_MARGIN }/>
                <InfoRow
                    icon={ ICON_NAMES.odometer }
                    title={ "Kilométeróra-állás" }
                    subtitle={ `${ odometerLog?.value } ${ odometerLog?.unit.short }` }
                />
                <Divider color={ DIVIDER_COLOR } margin={ DIVIDER_MARGIN }/>
                <InfoRow
                    icon={ ICON_NAMES.calendar }
                    title={ "Dátum" }
                    subtitle={ dayjs(odometerLog?.date).format("YYYY. MM DD. HH:mm") }
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
                onEditPress={ onEdit }
            />
        </>
    );
}