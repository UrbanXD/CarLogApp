import { router } from "expo-router";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import React, { useCallback, useMemo } from "react";
import { InfoRowProps } from "../../../../../components/info/InfoRow.tsx";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../../../../constants";
import dayjs from "dayjs";
import { ScreenScrollView } from "../../../../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { InfoContainer } from "../../../../../components/info/InfoContainer.tsx";
import { FuelLog } from "../schemas/fuelLogSchema.ts";
import { FuelLogFormFieldsEnum } from "../enums/fuelLogFormFields.tsx";
import { FloatingDeleteButton } from "../../../../../components/Button/presets/FloatingDeleteButton.tsx";
import { AmountText } from "../../../../../components/AmountText.tsx";
import { useTranslation } from "react-i18next";
import { DeleteToast, NotFoundToast } from "../../../../../ui/alert/presets/toast";
import { DeleteModal } from "../../../../../ui/alert/presets/modal";
import { useWatchedQueryItem } from "../../../../../database/hooks/useWatchedQueryItem.ts";

export type FuelLogViewProps = {
    id: string
}

export function FuelLogView({ id }: FuelLogViewProps) {
    const { t } = useTranslation();
    const { fuelLogDao } = useDatabase();
    const { openModal, openToast } = useAlert();

    const memoizedQuery = useMemo(() => fuelLogDao.fuelLogWatchedQueryItem(id), [fuelLogDao, id]);
    const { data: fuelLog } = useWatchedQueryItem(memoizedQuery);

    const handleDelete = useCallback(async (fuelLog: FuelLog) => {
        try {
            await fuelLogDao.deleteLog(fuelLog);

            openToast(DeleteToast.success(t("fuel.log")));

            if(router.canGoBack()) return router.back();
            router.replace("/(main)/expense");
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("fuel.log")));
        }
    }, [fuelLog, t]);

    const onDelete = useCallback(() => {
        if(!fuelLog) {
            return openToast(NotFoundToast.warning(t("fuel.log")));
        }

        openModal(DeleteModal({
            name: t("fuel.log"),
            acceptAction: () => handleDelete(fuelLog)
        }));
    }, [fuelLog, openToast, openModal, t]);

    const onEdit = useCallback((field?: FuelLogFormFieldsEnum) => {
        if(!fuelLog) {
            return openToast(NotFoundToast.warning(t("fuel.log")));
        }

        router.push({
            pathname: "/expense/edit/fuel/[id]",
            params: { id: fuelLog.id, field: field }
        });
    }, [fuelLog, openToast, t]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: fuelLog?.car.name,
            content: `${ fuelLog?.car.model.make.name } ${ fuelLog?.car.model.name }`,
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
                  amountTextStyle={ [textStyle, { textAlign: "left" }] }
               />,
            onPress: () => onEdit(FuelLogFormFieldsEnum.Amount),
            secondaryInfo:
                fuelLog?.originalPricePerUnit !== 0
                ? {
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
                : undefined
        },
        {
            icon: ICON_NAMES.calendar,
            title: t("date.text"),
            content: dayjs(fuelLog?.expense?.date).format("LLL"),
            onPress: () => onEdit(FuelLogFormFieldsEnum.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.odometer,
            title: t("odometer.value"),
            content: fuelLog?.odometer
                     ? `${ fuelLog?.odometer?.value } ${ fuelLog.odometer.unit.short }`
                     : t("common.not_assigned"),
            contentTextStyle: !fuelLog?.odometer && { color: COLORS.gray2 },
            onPress: () => onEdit(FuelLogFormFieldsEnum.DateAndOdometerValue)
        },
        {
            icon: ICON_NAMES.note,
            content: fuelLog?.expense?.note ?? t("common.no_notes"),
            contentTextStyle: !fuelLog?.expense?.note && { color: COLORS.gray2 },
            onPress: () => onEdit(FuelLogFormFieldsEnum.Note)
        }
    ]), [fuelLog, t]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ t("expenses.types.FUEL") }
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