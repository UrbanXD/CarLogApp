import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDatabase } from "../contexts/database/DatabaseContext.ts";
import { Car } from "../features/car/schemas/carSchema.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import { InfoRowProps } from "../components/InfoRow.tsx";
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
import useCars from "../features/car/hooks/useCars.ts";
import { InfoContainer } from "../components/info/InfoContainer.tsx";
import { OdometerLogFormFields } from "../features/car/_features/odometer/enums/odometerLogFormFields.ts";

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
                setOdometerLog(log);
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
            const odometer = await odometerLogDao.getOdometerByCarId(car.id);

            if(odometer?.value) {
                dispatch(updateCarOdometer({ carId: car.id, value: odometer.value }));
            }

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

    const onEdit = useCallback((field?: OdometerLogFormFields) => {
        if(!odometerLog) return openToast({ type: "warning", title: "Napló bejegyzés nem található!" });

        router.push({
            pathname: "/odometer/log/edit/[id]",
            params: { id: odometerLog.id, field: field }
        });
    });

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: car?.name,
            subtitle: `${ car?.model.make.name } ${ car?.model.name }`,
            onPress: () => onEdit(OdometerLogFormFields.Car)
        },
        {
            icon: ICON_NAMES.odometer,
            title: "Kilométeróra-állás",
            subtitle: `${ odometerLog?.value } ${ odometerLog?.unit.short }`,
            onPress: () => onEdit(OdometerLogFormFields.OdometerValue)
        },
        {
            icon: ICON_NAMES.calendar,
            title: "Dátum",
            subtitle: dayjs(odometerLog?.date).format("YYYY. MM DD. HH:mm"),
            onPress: () => onEdit(OdometerLogFormFields.Date)
        },
        {
            icon: ICON_NAMES.note,
            subtitle: odometerLog?.note ?? "Nincs megjegyzés",
            subtitleStyle: !odometerLog?.note && { color: COLORS.gray2 },
            onPress: () => onEdit(OdometerLogFormFields.Note)
        }
    ]), [car, odometerLog]);

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
                <InfoContainer data={ infos }/>
            </ScreenScrollView>
            <Button.EditDelete
                buttonContainerStyle={ { paddingBottom: bottom + SEPARATOR_SIZES.lightSmall } }
                onDeletePress={ onDelete }
                onEditPress={ onEdit }
            />
        </>
    );
}