import { router, useFocusEffect } from "expo-router";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../../car/hooks/useCars.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Car } from "../../../../car/schemas/carSchema.ts";
import { DeleteExpenseToast } from "../../../presets/toasts/DeleteExpenseToast.ts";
import { InfoRowProps } from "../../../../../components/info/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import dayjs from "dayjs";
import { ScreenScrollView } from "../../../../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { InfoContainer } from "../../../../../components/info/InfoContainer.tsx";
import { FloatingDeleteButton } from "../../../../../components/Button/presets/FloatingDeleteButton.tsx";
import { ServiceLog } from "../schemas/serviceLogSchema.ts";
import { ServiceItemExpandableList } from "./ServiceItemExpandableList.tsx";
import { ServiceLogFormFieldsEnum } from "../enums/ServiceLogFormFieldsEnum.ts";
import { Odometer } from "../../../../car/_features/odometer/schemas/odometerSchema.ts";
import { updateCarOdometer } from "../../../../car/model/slice/index.ts";

export type ServiceLogViewProps = {
    id: string
}

export function ServiceLogView({ id }: ServiceLogViewProps) {
    const { serviceLogDao } = useDatabase();
    const { getCar } = useCars();
    const { openModal, openToast } = useAlert();

    const [car, setCar] = useState<Car | null>(null);
    const [serviceLog, setServiceLog] = useState<ServiceLog | null>(null);
    const [isServiceItemListExpanded, setServiceItemListExpanded] = useState(false);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setServiceLog(await serviceLogDao.getById(id));
            })();
        }, [id, serviceLogDao])
    );

    useEffect(() => {
        if(car?.id === serviceLog?.expense.carId || !serviceLog?.expense.carId) return;

        setCar(getCar(serviceLog.expense.carId));
    }, [serviceLog]);

    const handleDelete = useCallback(async (serviceLog: ServiceLog) => {
        try {
            if(!car) throw new Error("Car not found!");

            const resultId = await serviceLogDao.delete(serviceLog);

            let odometer: Odometer | null = null;
            if(resultId && serviceLog.odometer?.carId) odometer = await odometerLogDao.getOdometerByCarId(serviceLog.odometer.carId);

            if(odometer) dispatch(updateCarOdometer({ odometer }));

            openToast(DeleteExpenseToast.success());

            if(router.canGoBack()) return router.back();
            router.replace("/(main)/expense");
        } catch(e) {
            console.log(e);
            openToast(DeleteExpenseToast.error());
        }
    }, [serviceLogDao, car]);

    const onDelete = useCallback(() => {
        if(!serviceLog) return openToast({ type: "warning", title: "Kiadás nem található!" });

        openModal({
            title: `Szervíz napló bejegyzés törlése`,
            body: `A törlés egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            acceptAction: () => handleDelete(serviceLog)
        });
    }, [serviceLog, handleDelete, openToast, openModal]);

    const onEdit = useCallback((field: ServiceLogFormFieldsEnum) => {
        if(!serviceLog) return openToast({ type: "warning", title: "Szervíz napló bejegyzés nem található!" });

        router.push({
            pathname: "/expense/edit/service/[id]",
            params: { id: serviceLog.id, field: field }
        });
    }, [serviceLog, openToast]);

    const getAmountSubtitle = useCallback(() => {
        let subtitle = `${ serviceLog?.expense.originalAmount } ${ serviceLog?.expense.currency.symbol }`;
        if(serviceLog?.expense.currency.id === car?.currency.id && serviceLog?.expense.exchangeRate === 1) return subtitle;

        subtitle += ` (${ serviceLog?.expense.amount } ${ car?.currency.symbol })`;
        return subtitle;
    }, [serviceLog, car]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: car?.name,
            content: `${ car?.model.make.name } ${ car?.model.name }`,
            onPress: () => onEdit(ServiceLogFormFieldsEnum.Car)
        },
        {
            icon: ICON_NAMES.expenseItem,
            title: "Szervizelési tételek",
            content: isServiceItemListExpanded ? " " : getAmountSubtitle(),
            secondaryInfo: { icon: isServiceItemListExpanded ? ICON_NAMES.upArrowHead : ICON_NAMES.downArrowHead },
            onPress: () => setServiceItemListExpanded(prevState => !prevState),
            renderContent: () => serviceLog && <ServiceItemExpandableList
               data={ serviceLog.items }
               totalAmount={ serviceLog.totalAmount }
               expanded={ isServiceItemListExpanded }
               actionIcon={ ICON_NAMES.pencil }
               onAction={ () => {
                   setServiceItemListExpanded(false);
                   onEdit(ServiceLogFormFieldsEnum.ServiceItems);
               } }
            />
        },
        {
            icon: ICON_NAMES.calendar,
            title: "Dátum",
            content: dayjs(serviceLog?.expense?.date).format("YYYY. MM DD. HH:mm"),
            onPress: () => onEdit(ServiceLogFormFieldsEnum.Date)
        },
        {
            icon: ICON_NAMES.odometer,
            title: "Kilométeróra-állás",
            content: serviceLog?.odometer
                     ? `${ serviceLog.odometer.value } ${ serviceLog.odometer.unit.short }`
                     : "Nincs hozzárendelve",
            contentTextStyle: !serviceLog?.odometer && { color: COLORS.gray2 },
            onPress: () => onEdit(ServiceLogFormFieldsEnum.OdometerValue)
        },
        {
            icon: ICON_NAMES.note,
            content: serviceLog?.expense?.note ?? "Nincs megjegyzés",
            contentTextStyle: !serviceLog?.expense?.note && { color: COLORS.gray2 },
            onPress: () => onEdit(ServiceLogFormFieldsEnum.Note)
        }
    ]), [car, serviceLog, isServiceItemListExpanded, getAmountSubtitle]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ serviceLog?.serviceType.key }
                    dividerStyle={ {
                        backgroundColor: serviceLog?.expense.type?.primaryColor ?? COLORS.gray2,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
                <InfoContainer data={ infos }/>
            </ScreenScrollView>
            <FloatingDeleteButton onPress={ onDelete }/>
        </>
    );
}