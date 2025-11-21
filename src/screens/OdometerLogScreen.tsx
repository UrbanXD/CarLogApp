import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDatabase } from "../contexts/database/DatabaseContext.ts";
import { Car } from "../features/car/schemas/carSchema.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import { InfoRowProps } from "../components/info/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../constants/index.ts";
import { useAlert } from "../ui/alert/hooks/useAlert.ts";
import { DeleteOdometerLogToast } from "../features/car/_features/odometer/presets/toast/DeleteOdometerLogToast.ts";
import { OdometerLog } from "../features/car/_features/odometer/schemas/odometerLogSchema.ts";
import dayjs from "dayjs";
import { Title } from "../components/Title.tsx";
import { updateCarOdometer } from "../features/car/model/slice/index.ts";
import { useAppDispatch } from "../hooks/index.ts";
import useCars from "../features/car/hooks/useCars.ts";
import { InfoContainer } from "../components/info/InfoContainer.tsx";
import { OdometerLogFormFields } from "../features/car/_features/odometer/enums/odometerLogFormFields.ts";
import { FloatingDeleteButton } from "../components/Button/presets/FloatingDeleteButton.tsx";
import { useTranslation } from "react-i18next";

export function OdometerLogScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const { getCar } = useCars();
    const { odometerLogDao } = useDatabase();
    const { openModal, openToast } = useAlert();

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

    const handleDelete = useCallback(async (odometerLog: OdometerLog) => {
        try {
            if(!car) throw new Error("Car not found!");

            await odometerLogDao.deleteOdometerChangeLog(odometerLog.id, odometerLog.relatedId);
            const odometer = await odometerLogDao.getOdometerByCarId(odometerLog.carId);

            dispatch(updateCarOdometer({ odometer }));

            openToast(DeleteOdometerLogToast.success());

            if(router.canGoBack()) return router.back();
            router.replace("/odometer/log");
        } catch(e) {
            console.log(e);
            openToast(DeleteOdometerLogToast.error());
        }
    }, [odometerLogDao, car]);

    const onDelete = useCallback(() => {
        if(!odometerLog) return openToast({ type: "warning", title: t("modal.log_not_found") });
        openModal({
            title: t("modal.log_delete_title", { name: t("odometer.title") }),
            body: t("modal.delete_message"),
            acceptText: t("form_button.delete"),
            acceptAction: () => handleDelete(odometerLog)
        });
    }, [odometerLog, openToast, openModal]);

    const onEdit = useCallback((field?: OdometerLogFormFields) => {
        if(!odometerLog) return openToast({ type: "warning", title: t("modal.log_not_found") });

        router.push({
            pathname: "/odometer/log/edit/[id]",
            params: { id: odometerLog.id, field: field }
        });
    });

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: car?.name,
            content: `${ car?.model.make.name } ${ car?.model.name }`,
            onPress: () => onEdit(OdometerLogFormFields.Car)
        },
        {
            icon: ICON_NAMES.odometer,
            title: t("odometer.title"),
            content: `${ odometerLog?.value } ${ odometerLog?.unit.short }`,
            onPress: () => onEdit(OdometerLogFormFields.OdometerValue)
        },
        {
            icon: ICON_NAMES.calendar,
            title: t("date.text"),
            content: dayjs(odometerLog?.date).format("YYYY. MM DD. HH:mm"),
            onPress: () => onEdit(OdometerLogFormFields.Date)
        },
        {
            icon: ICON_NAMES.note,
            content: odometerLog?.note ?? t("common.no_notes"),
            contentTextStyle: !odometerLog?.note && { color: COLORS.gray2 },
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
            <FloatingDeleteButton onPress={ onDelete }/>
        </>
    );
}