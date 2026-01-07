import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { ScreenScrollView } from "../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../components/Title.tsx";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { Expense } from "../../features/expense/schemas/expenseSchema.ts";
import { Car } from "../../features/car/schemas/carSchema.ts";
import useCars from "../../features/car/hooks/useCars.ts";
import dayjs from "dayjs";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { InfoContainer } from "../../components/info/InfoContainer.tsx";
import { ExpenseFormFields } from "../../features/expense/enums/expenseFormFields.ts";
import { InfoRowProps } from "../../components/info/InfoRow.tsx";
import { FloatingDeleteButton } from "../../components/Button/presets/FloatingDeleteButton.tsx";
import { AmountText } from "../../components/AmountText.tsx";
import { useTranslation } from "react-i18next";
import { DeleteToast, NotFoundToast } from "../../ui/alert/presets/toast/index.ts";
import { DeleteModal } from "../../ui/alert/presets/modal/index.ts";

export function ExpenseScreen() {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams();
    const { expenseDao } = useDatabase();
    const { getCar } = useCars();
    const { openModal, openToast } = useAlert();

    const [car, setCar] = useState<Car | null>(null);
    const [expense, setExpense] = useState<Expense | null>(null);

    useFocusEffect(
        useCallback(() => {
            const getExpense = async () => setExpense(await expenseDao.getById(id));

            getExpense();
        }, [id, expenseDao])
    );

    useEffect(() => {
        if(car?.id === expense?.carId || !expense?.carId) return;

        setCar(getCar(expense.carId));
    }, [expense]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await expenseDao.delete(id);

            openToast(DeleteToast.success(t("expenses.title_singular")));

            if(router.canGoBack()) return router.back();
            router.replace("/(main)/expense");
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("expenses.title_singular")));
        }
    }, [expenseDao, t]);

    const onDelete = useCallback(() => {
        if(!expense) return openToast(NotFoundToast.warning(t("expenses.title_singular")));

        openModal(DeleteModal({ name: t("expenses.title_singular"), acceptAction: () => handleDelete(expense.id) }));
    }, [expense, openToast, openModal, t]);

    const getAmountSubtitle = useCallback(() => {
        let subtitle = `${ expense?.amount.amount } ${ expense?.amount.currency.symbol }`;
        if(expense?.amount.currency.id === expense?.amount.exchangeCurrency.id && expense?.amount.exchangeRate === 1) return subtitle;

        subtitle += ` (${ expense?.amount.exchangedAmount } ${ expense?.amount?.exchangeCurrency.symbol })`;
        return subtitle;
    }, [expense, t]);

    const onEdit = useCallback((field?: ExpenseFormFields) => {
        if(!expense) return openToast(NotFoundToast.warning(t("expenses.title_singular")));

        router.push({
            pathname: "/expense/edit/[id]",
            params: { id: expense.id, field: field }
        });
    }, [expense, openToast, t]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: car?.name,
            content: `${ car?.model.make.name } ${ car?.model.name }`,
            onPress: () => onEdit(ExpenseFormFields.Car)
        },
        {
            icon: ICON_NAMES.money,
            title: t("currency.price"),
            content: (textStyle) => expense &&
               <AmountText
                  amount={ expense.amount.amount }
                  currencyText={ expense.amount.currency.symbol }
                  exchangedAmount={ expense.amount.exchangedAmount }
                  exchangeCurrencyText={ expense.amount.exchangeCurrency.symbol }
                  amountTextStyle={ textStyle ? [...textStyle, { textAlign: "left" }] : { textAlign: "left" } }
               />,
            onPress: () => onEdit(ExpenseFormFields.Amount)
        },
        {
            icon: ICON_NAMES.calendar,
            title: t("date.text"),
            content: dayjs(expense?.date).format("LLL"),
            onPress: () => onEdit(ExpenseFormFields.Date)
        },
        {
            icon: ICON_NAMES.note,
            content: expense?.note ?? t("common.no_notes"),
            contentTextStyle: !expense?.note && { color: COLORS.gray2 },
            onPress: () => onEdit(ExpenseFormFields.Note)
        }
    ]), [car, expense, getAmountSubtitle, t]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ t(`expenses.types.${ expense?.type.key }`) }
                    dividerStyle={ {
                        backgroundColor: expense?.type?.primaryColor ?? COLORS.gray2,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
                <InfoContainer data={ infos }/>
            </ScreenScrollView>
            <FloatingDeleteButton onPress={ onDelete }/>
        </>
    );
}