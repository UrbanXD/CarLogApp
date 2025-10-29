import { router, useFocusEffect } from "expo-router";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../hooks/useCars.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import { DeleteExpenseToast } from "../../../../expense/presets/toasts/DeleteExpenseToast.ts";
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

export type FuelLogViewProps = {
    id: string
}

export function FuelLogView({ id }: FuelLogViewProps) {
    const { fuelLogDao } = useDatabase();
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

            await fuelLogDao.delete(fuelLog);

            openToast(DeleteExpenseToast.success());

            if(router.canGoBack()) return router.back();
            router.replace("/(main)/expense");
        } catch(e) {
            console.log(e);
            openToast(DeleteExpenseToast.error());
        }
    }, [fuelLog, car]);

    const onDelete = useCallback(() => {
        if(!fuelLog) return openToast({ type: "warning", title: "Kiadás nem található!" });

        openModal({
            title: `Kiadás napló bejegyzés törlése`,
            body: `A törlés egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            acceptAction: () => handleDelete(fuelLog)
        });
    }, [fuelLog, openToast, openModal]);

    const onEdit = useCallback((field?: FuelLogFormFieldsEnum) => {
        if(!fuelLog) return openToast({ type: "warning", title: "Napló bejegyzés nem található!" });

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
            title: "Tankolás",
            content: `${ fuelLog?.quantity } ${ fuelLog?.fuelUnit.short }`,
            onPress: () => onEdit(FuelLogFormFieldsEnum.Quantity)
        },
        {
            icon: ICON_NAMES.money,
            title: "Ár",
            content: (textStyle) => fuelLog &&
               <AmountText
                  amount={ fuelLog.expense.originalAmount }
                  currencyText={ fuelLog.expense.currency.symbol }
                  exchangedAmount={ fuelLog.expense.originalAmount }
                  exchangeCurrencyText={ car?.currency.symbol }
                  amountTextStyle={ textStyle ? [...textStyle, { textAlign: "left" }] : { textAlign: "left" } }
               />,
            onPress: () => onEdit(FuelLogFormFieldsEnum.Amount),
            secondaryInfo: {
                title: "Egységár",
                content: (textStyle) => fuelLog &&
                   <AmountText
                      amount={ fuelLog.originalPricePerUnit }
                      currencyText={ `${ fuelLog.expense.currency.symbol }/${ fuelLog.fuelUnit.short }` }
                      exchangedAmount={ fuelLog.pricePerUnit }
                      exchangeCurrencyText={ `${ car?.currency.symbol }/${ fuelLog.fuelUnit.short }` }
                      amountTextStyle={ textStyle }
                   />
            }
        },
        {
            icon: ICON_NAMES.calendar,
            title: "Dátum",
            content: dayjs(fuelLog?.expense?.date).format("YYYY. MM DD. HH:mm"),
            onPress: () => onEdit(FuelLogFormFieldsEnum.Date)
        },
        {
            icon: ICON_NAMES.odometer,
            title: "Kilométeróra-állás",
            content: fuelLog?.odometer
                     ? `${ fuelLog?.odometer?.value } ${ fuelLog.odometer.unit.short }`
                     : "Nincs hozzárendelve",
            contentTextStyle: !fuelLog?.odometer && { color: COLORS.gray2 },
            onPress: () => onEdit(FuelLogFormFieldsEnum.OdometerValue)
        },
        {
            icon: ICON_NAMES.note,
            content: fuelLog?.expense?.note ?? "Nincs megjegyzés",
            contentTextStyle: !fuelLog?.expense?.note && { color: COLORS.gray2 },
            onPress: () => onEdit(FuelLogFormFieldsEnum.Note)
        }
    ]), [car, fuelLog]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ fuelLog?.expense.type?.locale }
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