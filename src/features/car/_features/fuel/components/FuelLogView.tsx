import { router, useFocusEffect } from "expo-router";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../hooks/useCars.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import { InfoRowProps } from "../../../../../components/info/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import dayjs from "dayjs";
import { ScreenScrollView } from "../../../../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { InfoContainer } from "../../../../../components/info/InfoContainer.tsx";
import { FuelLog } from "../schemas/fuelLogSchema.ts";
import { FuelLogFormFieldsEnum } from "../enums/fuelLogFormFields.tsx";
import { FloatingDeleteButton } from "../../../../../components/Button/presets/FloatingDeleteButton.tsx";
import { AmountText } from "../../../../../components/AmountText.tsx";
import { updateCarOdometer } from "../../../model/slice/index.ts";
import { Odometer } from "../../odometer/schemas/odometerSchema.ts";
import { useTranslation } from "react-i18next";
import { DeleteToast, NotFoundToast } from "../../../../../ui/alert/presets/toast/index.ts";
import { DeleteModal } from "../../../../../ui/alert/presets/modal/index.ts";
import { useAppDispatch } from "../../../../../hooks/index.ts";

export type FuelLogViewProps = {
    id: string
}

export function FuelLogView({ id }: FuelLogViewProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { fuelLogDao, odometerLogDao } = useDatabase();
    const { getCar } = useCars();
    const { openModal, openToast } = useAlert();

    const [car, setCar] = useState<Car | null>(null);
    const [fuelLog, setFuelLog] = useState<FuelLog | null>(null);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setFuelLog(await fuelLogDao.getById(id));
            })();
        }, [id, fuelLogDao])
    );

    useEffect(() => {
        if(car?.id === fuelLog?.expense.carId || !fuelLog?.expense.carId) return;

        setCar(getCar(fuelLog.expense.carId));
    }, [fuelLog]);

    const handleDelete = useCallback(async (fuelLog: FuelLog) => {
        try {
            if(!car) throw new Error("Car not found!");

            const resultId = await fuelLogDao.delete(fuelLog);

            let odometer: Odometer | null = null;
            if(resultId && fuelLog.odometer?.carId) odometer = await odometerLogDao.getOdometerByLogId(fuelLog.odometer.carId);

            if(odometer) dispatch(updateCarOdometer({ odometer }));

            openToast(DeleteToast.success(t("fuel.log")));

            if(router.canGoBack()) return router.back();
            router.replace("/(main)/expense");
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("fuel.log")));
        }
    }, [fuelLog, car]);

    const onDelete = useCallback(() => {
        if(!fuelLog) {
            return openToast(NotFoundToast.warning(t("fuel.log")));
        }

        openModal(DeleteModal({
            name: t("fuel.log"),
            acceptAction: () => handleDelete(fuelLog)
        }));
    }, [fuelLog, openToast, openModal]);

    const onEdit = useCallback((field?: FuelLogFormFieldsEnum) => {
        if(!fuelLog) {
            return openToast(NotFoundToast.warning(t("fuel.log")));
        }

        router.push({
            pathname: "/expense/edit/fuel/[id]",
            params: { id: fuelLog.id, field: field }
        });
    }, [fuelLog, openToast]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: car?.name,
            content: `${ car?.model.make.name } ${ car?.model.name }`,
            onPress: () => onEdit(FuelLogFormFieldsEnum.Car)
        },
        {
            icon: ICON_NAMES.fuelPump,
            title: t("fuel.fueling"),
            content: `${ fuelLog?.quantity } ${ fuelLog?.fuelUnit.short }`,
            onPress: () => onEdit(FuelLogFormFieldsEnum.Quantity)
        },
        {
            icon: ICON_NAMES.money,
            title: t("currency.price"),
            content: (textStyle) => fuelLog &&
               <AmountText
                  amount={ fuelLog.expense.amount.amount }
                  currencyText={ fuelLog.expense.amount.currency.symbol }
                  exchangedAmount={ fuelLog.expense.amount.exchangedAmount }
                  exchangeCurrencyText={ fuelLog.expense.amount.exchangeCurrency.symbol }
                  amountTextStyle={ textStyle ? [...textStyle, { textAlign: "left" }] : { textAlign: "left" } }
               />,
            onPress: () => onEdit(FuelLogFormFieldsEnum.Amount),
            secondaryInfo: {
                title: t("currency.price_per_unit"),
                content: (textStyle) => fuelLog &&
                   <AmountText
                      amount={ fuelLog.originalPricePerUnit }
                      currencyText={ `${ fuelLog.expense.amount.currency.symbol }/${ fuelLog.fuelUnit.short }` }
                      exchangedAmount={ fuelLog.pricePerUnit }
                      exchangeCurrencyText={ `${ fuelLog.expense.amount.exchangeCurrency.symbol }/${ fuelLog.fuelUnit.short }` }
                      amountTextStyle={ textStyle }
                   />
            }
        },
        {
            icon: ICON_NAMES.calendar,
            title: t("date.text"),
            content: dayjs(fuelLog?.expense?.date).format("YYYY. MM DD. HH:mm"),
            onPress: () => onEdit(FuelLogFormFieldsEnum.Date)
        },
        {
            icon: ICON_NAMES.odometer,
            title: t("odometer.value"),
            content: fuelLog?.odometer
                     ? `${ fuelLog?.odometer?.value } ${ fuelLog.odometer.unit.short }`
                     : t("common.not_assigned"),
            contentTextStyle: !fuelLog?.odometer && { color: COLORS.gray2 },
            onPress: () => onEdit(FuelLogFormFieldsEnum.OdometerValue)
        },
        {
            icon: ICON_NAMES.note,
            content: fuelLog?.expense?.note ?? t("common.no_notes"),
            contentTextStyle: !fuelLog?.expense?.note && { color: COLORS.gray2 },
            onPress: () => onEdit(FuelLogFormFieldsEnum.Note)
        }
    ]), [car, fuelLog]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ t("expenses.types.fuel") }
                    dividerStyle={ {
                        backgroundColor: fuelLog?.expense.type?.primaryColor ?? COLORS.gray2,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
                <InfoContainer data={ infos }/>
            </ScreenScrollView>
            <FloatingDeleteButton onPress={ onDelete }/>
        </>
    );
}