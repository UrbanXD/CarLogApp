import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import React, { useCallback, useMemo } from "react";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";
import { DeleteToast, NotFoundToast } from "../../../../../ui/alert/presets/toast";
import { DeleteModal } from "../../../../../ui/alert/presets/modal";
import { OdometerLogFormFieldsEnum } from "../enums/odometerLogFormFields.ts";
import { InfoRowProps } from "../../../../../components/info/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../../../../constants";
import dayjs from "dayjs";
import { ScreenScrollView } from "../../../../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { InfoContainer } from "../../../../../components/info/InfoContainer.tsx";
import { FloatingDeleteButton } from "../../../../../components/Button/presets/FloatingDeleteButton.tsx";
import { useWatchedQueryItem } from "../../../../../database/hooks/useWatchedQueryItem.ts";

type OdometerLogViewProps = {
    id: string
}

export function OdometerLogView({ id }: OdometerLogViewProps) {
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();
    const { openModal, openToast } = useAlert();

    const memoizedQuery = useMemo(() => odometerLogDao.odometerLogWatchedQueryItem(id), [odometerLogDao, id]);
    const { data: odometerLog, isLoading } = useWatchedQueryItem(memoizedQuery);

    const handleDelete = useCallback(async (odometerLog: OdometerLog) => {
        try {
            if(!odometerLog.relatedId) throw new Error("Odometer change log id not found!");

            await odometerLogDao.deleteOdometerChangeLog(odometerLog.id, odometerLog.relatedId);

            openToast(DeleteToast.success(t("odometer.log")));
            if(router.canGoBack()) return router.back();
            router.replace("/odometer/log");
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("odometer.log")));
        }
    }, [odometerLogDao, odometerLog, t]);

    const onDelete = useCallback(() => {
        if(!odometerLog) return openToast(NotFoundToast.warning(t("odometer.log")));

        openModal(DeleteModal({
            name: t("odometer.log"),
            acceptAction: () => handleDelete(odometerLog)
        }));
    }, [odometerLog, openToast, openModal, t]);

    const onEdit = useCallback((field?: OdometerLogFormFieldsEnum) => {
        if(!odometerLog) return openToast(NotFoundToast.warning(t("odometer.log")));

        router.push({
            pathname: "/odometer/log/edit/[id]",
            params: { id: odometerLog.id, field: field }
        });
    }, [t, odometerLog]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: odometerLog?.car.name,
            content: `${ odometerLog?.car.model.make.name } ${ odometerLog?.car.model.name }`,
            onPress: () => onEdit(OdometerLogFormFieldsEnum.Car)
        },
        {
            icon: ICON_NAMES.odometer,
            title: t("odometer.value"),
            content: `${ odometerLog?.value } ${ odometerLog?.unit.short }`,
            onPress: () => onEdit(OdometerLogFormFieldsEnum.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.calendar,
            title: t("date.text"),
            content: dayjs(odometerLog?.date).format("LLL"),
            onPress: () => onEdit(OdometerLogFormFieldsEnum.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.note,
            content: odometerLog?.note ?? t("common.no_notes"),
            contentTextStyle: !odometerLog?.note ? { color: COLORS.gray2 } : undefined,
            onPress: () => onEdit(OdometerLogFormFieldsEnum.Note)
        }
    ]), [odometerLog, t]);

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
                <InfoContainer data={ infos } isLoading={ isLoading }/>
            </ScreenScrollView>
            <FloatingDeleteButton onPress={ onDelete }/>
        </>
    );
}