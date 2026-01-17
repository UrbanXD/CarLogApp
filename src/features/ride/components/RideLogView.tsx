import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import useCars from "../../car/hooks/useCars.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { useRideExpenseToExpandableList } from "../_features/rideExpense/hooks/useRideExpenseToExpandableList.ts";
import { useRidePlaceToExpandableList } from "../_features/place/hooks/useRidePlaceToExpandableList.ts";
import { useRidePassengerToExpandableList } from "../_features/passenger/hooks/useRidePassengerToExpandableList.ts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Car } from "../../car/schemas/carSchema.ts";
import { RideLog } from "../schemas/rideLogSchema.ts";
import { router, useFocusEffect } from "expo-router";
import { Odometer } from "../../car/_features/odometer/schemas/odometerSchema.ts";
import { useAppDispatch } from "../../../hooks/index.ts";
import { updateCarOdometer } from "../../car/model/slice/index.ts";
import { RideLogFormFieldsEnum } from "../enums/RideLogFormFields.ts";
import { ExpandableList } from "../../../components/expandableList/ExpandableList.tsx";
import { Amount } from "../../_shared/currency/schemas/amountSchema.ts";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { InfoRowProps } from "../../../components/info/InfoRow.tsx";
import dayjs from "dayjs";
import { ScreenScrollView } from "../../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../../components/Title.tsx";
import { InfoContainer } from "../../../components/info/InfoContainer.tsx";
import { FloatingDeleteButton } from "../../../components/Button/presets/FloatingDeleteButton.tsx";
import { AmountText } from "../../../components/AmountText.tsx";
import { useTranslation } from "react-i18next";
import { DeleteToast, NotFoundToast } from "../../../ui/alert/presets/toast/index.ts";
import { DeleteModal } from "../../../ui/alert/presets/modal/index.ts";

export type RideLogViewProps = {
    id: string
}

export function RideLogView({ id }: RideLogViewProps) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { rideLogDao, odometerLogDao } = useDatabase();
    const { getCar } = useCars();
    const { openModal, openToast } = useAlert();
    const { rideExpenseToExpandableList } = useRideExpenseToExpandableList();
    const { ridePlaceToExpandableList } = useRidePlaceToExpandableList();
    const { ridePassengerToExpandableList } = useRidePassengerToExpandableList();

    const [car, setCar] = useState<Car | null>(null);
    const [rideLog, setRideLog] = useState<RideLog | null>(null);
    const [isExpenseListExpanded, setExpenseListExpanded] = useState(false);
    const [isPlaceListExpanded, setPlaceListExpanded] = useState(false);
    const [isPassengerListExpanded, setPassengerListExpanded] = useState(false);
    const [totalAmount, setTotalAmount] = useState<Array<Amount>>([]);

    useEffect(() => {
        const totals = new Map<string, Amount>();

        if(!rideLog) return;

        for(const item of rideLog.rideExpenses) {
            const key = item.expense.amount.currency.id.toString();

            const existing = totals.get(key);
            if(existing) {
                const newAmount = existing.amount + item.expense.amount.amount;
                const newExchangedAmount = existing.exchangedAmount + item.expense.amount.exchangedAmount;

                totals.set(key, { ...existing, amount: newAmount, exchangedAmount: newExchangedAmount });
            } else {
                totals.set(key, item.expense.amount);
            }
        }

        setTotalAmount(
            Array.from(totals.values()).sort((a, b) => b.amount - a.amount)
        );
    }, [rideLog?.rideExpenses]);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setRideLog(await rideLogDao.getById(id));
            })();
        }, [id, rideLogDao])
    );

    useEffect(() => {
        if(car?.id === rideLog?.carId || !rideLog?.carId) return;

        setCar(getCar(rideLog.carId));
    }, [rideLog]);

    const handleDelete = useCallback(async (rideLog: RideLog) => {
        try {
            const resultId = await rideLogDao.deleteLog(rideLog);

            let odometer: Odometer | null = null;
            if(resultId) odometer = await odometerLogDao.getOdometerByCarId(rideLog.carId);

            if(odometer) dispatch(updateCarOdometer({ odometer }));

            openToast(DeleteToast.success(t("rides.log")));

            if(router.canGoBack()) return router.back();
            router.replace("/(main)/workbook");
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("rides.log")));
        }
    }, [rideLogDao, t]);

    const onDelete = useCallback(() => {
        if(!rideLog) {
            return openToast({
                type: "warning",
                title: `${ t("modal.not_found", { name: t("rides.log") }) }`
            });
        }

        openModal(DeleteModal({
            name: t("rides.log"),
            acceptAction: () => handleDelete(rideLog)
        }));
    }, [rideLog, handleDelete, openToast, openModal, t]);

    const onEdit = useCallback((field: RideLogFormFieldsEnum) => {
        if(!rideLog) return openToast(NotFoundToast.warning(t("rides.log")));

        router.push({
            pathname: "/ride/edit/[id]",
            params: { id: rideLog.id, field: field }
        });
    }, [rideLog, openToast, t]);

    const renderRideExpenses = useCallback(() => {
        if(!rideLog) return <></>;

        return (
            <ExpandableList
                data={ rideLog.rideExpenses.map(rideExpenseToExpandableList) }
                subtitle={ t("currency.price") }
                totalAmount={ totalAmount }
                expanded={ isExpenseListExpanded }
                actionIcon={ ICON_NAMES.pencil }
                onAction={ () => {
                    setExpenseListExpanded(false);
                    onEdit(RideLogFormFieldsEnum.Expenses);
                } }
            />
        );
    }, [rideLog, onEdit, rideExpenseToExpandableList, isExpenseListExpanded, t]);

    const renderRidePlaces = useCallback(() => {
        if(!rideLog) return <></>;

        return (
            <ExpandableList
                data={ rideLog.ridePlaces.map(ridePlaceToExpandableList) }
                expanded={ isPlaceListExpanded }
                actionIcon={ ICON_NAMES.pencil }
                onAction={ () => {
                    setPlaceListExpanded(false);
                    onEdit(RideLogFormFieldsEnum.Places);
                } }
            />
        );
    }, [rideLog, onEdit, ridePlaceToExpandableList, isPlaceListExpanded]);

    const renderRidePassengers = useCallback(() => {
        if(!rideLog) return <></>;

        return (
            <ExpandableList
                data={ rideLog.ridePassengers.map(ridePassengerToExpandableList) }
                expanded={ isPassengerListExpanded }
                actionIcon={ ICON_NAMES.pencil }
                onAction={ () => {
                    setPassengerListExpanded(false);
                    onEdit(RideLogFormFieldsEnum.Passengers);
                } }
            />
        );
    }, [rideLog, onEdit, ridePassengerToExpandableList, isPassengerListExpanded]);

    const infos: Array<InfoRowProps> = useMemo(
        () => ([
            {
                icon: ICON_NAMES.car,
                title: car?.name,
                content: `${ car?.model.make.name } ${ car?.model.name }`,
                onPress: () => onEdit(RideLogFormFieldsEnum.Car)
            },
            {
                icon: ICON_NAMES.calendar,
                title: t("rides.start_time"),
                content: dayjs(rideLog?.startTime).format("LLL"),
                onPress: () => onEdit(RideLogFormFieldsEnum.DateAndOdometer),
                secondaryInfo: {
                    title: t("rides.end_time"),
                    content: dayjs(rideLog?.endTime).format("LLL")
                }
            },
            {
                icon: ICON_NAMES.odometer,
                title: t("rides.start_odometer"),
                content: `${ rideLog?.startOdometer.value } ${ rideLog?.startOdometer.unit.short }`,
                row: false,
                secondaryInfo: {
                    title: t("rides.end_odometer"),
                    content: `${ rideLog?.endOdometer.value } ${ rideLog?.endOdometer.unit.short }`
                },
                onPress: () => onEdit(RideLogFormFieldsEnum.DateAndOdometer)
            },
            {
                icon: ICON_NAMES.expenseItem,
                title: t("rides.expenses"),
                content: isExpenseListExpanded
                         ? " "
                         : (textStyle) =>
                             <AmountText
                                 amount={ totalAmount.reduce((sum, a) => sum + a.exchangedAmount, 0) }
                                 currencyText={ totalAmount[0]?.exchangeCurrency?.symbol ?? "?" }
                                 exchangedAmount={ totalAmount.length !== 1
                                                   ? totalAmount.map(a => Number(a.amount ?? 0))
                                                   : undefined }
                                 exchangeCurrencyText={ totalAmount.map(a => a.currency.symbol ?? "?") }
                                 amountTextStyle={ textStyle }
                                 freeText={ "-" }
                             />,
                actionIcon: isExpenseListExpanded ? ICON_NAMES.upArrowHead : ICON_NAMES.downArrowHead,
                onPress: () => setExpenseListExpanded(prevState => !prevState),
                renderContent: renderRideExpenses
            },
            {
                icon: ICON_NAMES.mapMarkers,
                title: t("rides.route"),
                actionIcon: isPlaceListExpanded ? ICON_NAMES.upArrowHead : ICON_NAMES.downArrowHead,
                onPress: () => setPlaceListExpanded(prevState => !prevState),
                renderContent: renderRidePlaces
            },
            {
                icon: ICON_NAMES.passengers,
                title: t("rides.passengers"),
                actionIcon: isPassengerListExpanded ? ICON_NAMES.upArrowHead : ICON_NAMES.downArrowHead,
                onPress: () => setPassengerListExpanded(prevState => !prevState),
                renderContent: renderRidePassengers
            },
            {
                icon: ICON_NAMES.note,
                content: rideLog?.note ?? t("common.no_notes"),
                contentTextStyle: !rideLog?.note ? { color: COLORS.gray2 } : undefined,
                onPress: () => onEdit(RideLogFormFieldsEnum.Note)
            }
        ]),
        [
            car,
            rideLog,
            isExpenseListExpanded,
            isPlaceListExpanded,
            isPassengerListExpanded,
            renderRideExpenses,
            renderRidePlaces,
            renderRidePassengers,
            t
        ]
    );

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ t("rides.item") }
                    dividerStyle={ {
                        backgroundColor: COLORS.ride,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
                <InfoContainer data={ infos }/>
            </ScreenScrollView>
            <FloatingDeleteButton onPress={ onDelete }/>
        </>
    );
}