import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDatabase } from "../contexts/database/DatabaseContext.ts";
import { Car } from "../features/car/schemas/carSchema.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import { InfoRowProps } from "../components/info/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../constants/index.ts";
import { useAlert } from "../ui/alert/hooks/useAlert.ts";
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
import { DeleteToast, NotFoundToast } from "../ui/alert/presets/toast/index.ts";
import { DeleteModal } from "../ui/alert/presets/modal/index.ts";

export function OdometerLogScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { getCar } = useCars();
    const { odometerLogDao } = useDatabase();
    const { openModal, openToast } = useAlert();

    const [car, setCar] = useState<Car | null>(null);
    const [odometerLog, setOdometerLog] = useState<OdometerLog | null>(null);

    useFocusEffect(
        useCallback(() => {
            const getOdometerLog = async () => {
                if(!id) return;
                const log = await odometerLogDao.getById(id);
                setOdometerLog(log);
            };

            getOdometerLog();
        }, [id, odometerLogDao])
    );

    useEffect(() => {
        if(car?.id === odometerLog?.carId || !odometerLog?.carId) return;

        setCar(getCar(odometerLog.carId) ?? null);
    }, [odometerLog]);

    const handleDelete = useCallback(async (odometerLog: OdometerLog) => {
        try {
            if(!car) throw new Error("Car not found!");
            if(!odometerLog.relatedId) throw new Error("Odometer change log id not found!");

            await odometerLogDao.deleteOdometerChangeLog(odometerLog.id, odometerLog.relatedId);
            const odometer = await odometerLogDao.getOdometerByCarId(odometerLog.carId);

            dispatch(updateCarOdometer({ odometer }));

            openToast(DeleteToast.success(t("odometer.log")));

            if(router.canGoBack()) return router.back();
            router.replace("/odometer/log");
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("odometer.log")));
        }
    }, [odometerLogDao, car, t]);

    const onDelete = useCallback(() => {
        if(!odometerLog) return openToast(NotFoundToast.warning(t("odometer.log")));

        openModal(DeleteModal({
            name: t("odometer.log"),
            acceptAction: () => handleDelete(odometerLog)
        }));
    }, [odometerLog, openToast, openModal, t]);

    const onEdit = useCallback((field?: OdometerLogFormFields) => {
        if(!odometerLog) return openToast(NotFoundToast.warning(t("odometer.log")));

        router.push({
            pathname: "/odometer/log/edit/[id]",
            params: { id: odometerLog.id, field: field }
        });
    }, [t, odometerLog]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: car?.name,
            content: `${ car?.model.make.name } ${ car?.model.name }`,
            onPress: () => onEdit(OdometerLogFormFields.Car)
        },
        {
            icon: ICON_NAMES.odometer,
            title: t("odometer.value"),
            content: `${ odometerLog?.value } ${ odometerLog?.unit.short }`,
            onPress: () => onEdit(OdometerLogFormFields.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.calendar,
            title: t("date.text"),
            content: dayjs(odometerLog?.date).format("LLL"),
            onPress: () => onEdit(OdometerLogFormFields.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.note,
            content: odometerLog?.note ?? t("common.no_notes"),
            contentTextStyle: !odometerLog?.note ? { color: COLORS.gray2 } : undefined,
            onPress: () => onEdit(OdometerLogFormFields.Note)
        }
    ]), [car, odometerLog, t]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ t(`odometer.types.${ odometerLog?.type.key }`) }
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