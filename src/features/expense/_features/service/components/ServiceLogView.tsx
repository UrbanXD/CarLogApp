import { router } from "expo-router";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import React, { useCallback, useMemo, useState } from "react";
import { InfoRowProps } from "../../../../../components/info/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../../../../constants";
import dayjs from "dayjs";
import { ScreenScrollView } from "../../../../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { InfoContainer } from "../../../../../components/info/InfoContainer.tsx";
import { FloatingDeleteButton } from "../../../../../components/Button/presets/FloatingDeleteButton.tsx";
import { ServiceLog } from "../schemas/serviceLogSchema.ts";
import { ServiceLogFormFieldsEnum } from "../enums/ServiceLogFormFieldsEnum.ts";
import { ExpandableList } from "../../../../../components/expandableList/ExpandableList.tsx";
import { useServiceItemToExpandableList } from "../hooks/useServiceItemToExpandableList.ts";
import { useTranslation } from "react-i18next";
import { DeleteToast, NotFoundToast } from "../../../../../ui/alert/presets/toast";
import { DeleteModal } from "../../../../../ui/alert/presets/modal";
import { useWatchedQueryItem } from "../../../../../database/hooks/useWatchedQueryItem.ts";

export type ServiceLogViewProps = {
    id: string
}

export function ServiceLogView({ id }: ServiceLogViewProps) {
    const { t } = useTranslation();
    const { serviceLogDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const { serviceItemToExpandableListItem } = useServiceItemToExpandableList();

    const memoizedQuery = useMemo(() => serviceLogDao.serviceLogWatchedQueryItem(id), [serviceLogDao, id]);
    const { data: serviceLog, isLoading } = useWatchedQueryItem(memoizedQuery);

    const [isServiceItemListExpanded, setServiceItemListExpanded] = useState(false);

    const handleDelete = useCallback(async (serviceLog: ServiceLog) => {
        try {
            await serviceLogDao.deleteLog(serviceLog);

            openToast(DeleteToast.success(t("service.log")));
            if(router.canGoBack()) return router.back();
            router.replace("/(main)/expense");
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("service.log")));
        }
    }, [serviceLogDao, t]);

    const onDelete = useCallback(() => {
        if(!serviceLog) return openToast(NotFoundToast.warning(t("service.log")));

        openModal(DeleteModal({ name: t("service.log"), acceptAction: () => handleDelete(serviceLog) }));
    }, [serviceLog, handleDelete, openToast, openModal, t]);

    const onEdit = useCallback((field: ServiceLogFormFieldsEnum) => {
        if(!serviceLog) return openToast(NotFoundToast.warning(t("service.log")));

        router.push({
            pathname: "/expense/edit/service/[id]",
            params: { id: serviceLog.id, field: field }
        });
    }, [serviceLog, openToast, t]);

    const getAmountSubtitle = useCallback(() => {
        let subtitle = `${ serviceLog?.expense.amount.amount } ${ serviceLog?.expense.amount.currency.symbol }`;
        if(serviceLog?.expense.amount.currency.id === serviceLog?.expense.amount.currency.id && serviceLog?.expense.amount.exchangeRate === 1) return subtitle;

        subtitle += ` (${ serviceLog?.expense.amount.exchangedAmount } ${ serviceLog?.expense.amount.exchangeCurrency.symbol })`;
        return subtitle;
    }, [serviceLog]);

    const renderServiceItems = useCallback(() => {
        if(!serviceLog) return <></>;

        return (
            <ExpandableList
                data={ serviceLog.items.map(serviceItemToExpandableListItem) }
                subtitle={ t("currency.price_per_unit") }
                totalAmount={ serviceLog.totalAmount }
                expanded={ isServiceItemListExpanded }
                actionIcon={ ICON_NAMES.pencil }
                onAction={ () => {
                    setServiceItemListExpanded(false);
                    onEdit(ServiceLogFormFieldsEnum.ServiceItems);
                } }
            />
        );
    }, [serviceLog, onEdit, serviceItemToExpandableListItem, isServiceItemListExpanded, t]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: serviceLog?.car?.name,
            content: `${ serviceLog?.car?.model.make.name } ${ serviceLog?.car?.model.name }`,
            onPress: () => onEdit(ServiceLogFormFieldsEnum.Car)
        },
        {
            icon: ICON_NAMES.expenseItem,
            title: t("service.items.title"),
            content: isServiceItemListExpanded ? " " : getAmountSubtitle(),
            actionIcon: isServiceItemListExpanded ? ICON_NAMES.upArrowHead : ICON_NAMES.downArrowHead,
            onPress: () => setServiceItemListExpanded(prevState => !prevState),
            renderContent: renderServiceItems
        },
        {
            icon: ICON_NAMES.calendar,
            title: t("date.text"),
            content: dayjs(serviceLog?.expense?.date).format("LLL"),
            onPress: () => onEdit(ServiceLogFormFieldsEnum.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.odometer,
            title: t("odometer.value"),
            content: serviceLog?.odometer
                     ? `${ serviceLog.odometer.value } ${ serviceLog.odometer.unit.short }`
                     : t("common.not_assigned"),
            contentTextStyle: !serviceLog?.odometer ? { color: COLORS.gray2 } : undefined,
            onPress: () => onEdit(ServiceLogFormFieldsEnum.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.note,
            content: serviceLog?.expense?.note ?? t("common.no_notes"),
            contentTextStyle: !serviceLog?.expense?.note ? { color: COLORS.gray2 } : undefined,
            onPress: () => onEdit(ServiceLogFormFieldsEnum.Note)
        }
    ]), [serviceLog, isServiceItemListExpanded, getAmountSubtitle, t]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ t(`service.types.${ serviceLog?.serviceType.key }`) }
                    dividerStyle={ {
                        backgroundColor: serviceLog?.expense.type?.primaryColor ?? COLORS.gray2,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
                <InfoContainer data={ infos } isLoading={ isLoading }/>
            </ScreenScrollView>
            <FloatingDeleteButton onPress={ onDelete }/>
        </>
    );
}