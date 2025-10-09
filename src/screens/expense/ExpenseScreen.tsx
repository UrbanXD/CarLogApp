import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { ScreenScrollView } from "../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../components/Title.tsx";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { Expense } from "../../features/expense/schemas/expenseSchema.ts";
import { Car } from "../../features/car/schemas/carSchema.ts";
import useCars from "../../features/car/hooks/useCars.ts";
import { InfoRowProps } from "../../components/InfoRow.tsx";
import dayjs from "dayjs";
import Button from "../../components/Button/Button.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { DeleteExpenseToast } from "../../features/expense/presets/toasts/DeleteExpenseToast.ts";
import { InfoContainer } from "../../components/info/InfoContainer.tsx";

const DIVIDER_COLOR = COLORS.gray3;
const DIVIDER_MARGIN = SEPARATOR_SIZES.lightSmall / 3;

export function ExpenseScreen() {
    const { id } = useLocalSearchParams();
    const { expenseDao } = useDatabase();
    const { getCar } = useCars();
    const { openModal, openToast } = useAlert();
    const { bottom } = useSafeAreaInsets();

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
            if(!car) throw new Error("Car not found!");

            await expenseDao.delete(id);

            openToast(DeleteExpenseToast.success());

            if(router.canGoBack()) return router.back();
            router.replace("/(main)/expense");
        } catch(e) {
            console.log(e);
            openToast(DeleteExpenseToast.error());
        }
    }, [expenseDao, car]);

    const onDelete = useCallback(() => {
        if(!expense) return openToast({ type: "warning", title: "Kiadás nem található!" });

        openModal({
            title: `Kiadás napló bejegyzés törlése`,
            body: `A törlés egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            acceptAction: () => handleDelete(expense.id)
        });
    }, [expense, openToast, openModal]);

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            icon: ICON_NAMES.car,
            title: car?.name,
            subtitle: `${ car?.model.make.name } ${ car?.model.name }`
        },
        {
            icon: ICON_NAMES.money,
            title: "Ár",
            subtitle: `${ expense?.originalAmount } ${ expense?.currency.symbol } (${ expense?.amount } ${ car?.currency.symbol })`
        },
        {
            icon: ICON_NAMES.calendar,
            title: "Dátum",
            subtitle: dayjs(expense?.date).format("YYYY. MM DD. HH:mm")
        },
        {
            icon: ICON_NAMES.note,
            subtitle: expense?.note ?? "Nincs megjegyzés",
            subtitleStyle: !expense?.note && { color: COLORS.gray2 }
        }
    ]), [car, expense]);

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ expense?.type.locale }
                    dividerStyle={ {
                        backgroundColor: expense?.type?.primaryColor ?? COLORS.gray2,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
                <InfoContainer data={ infos }/>
            </ScreenScrollView>
            <Button.EditDelete
                buttonContainerStyle={ { paddingBottom: bottom + SEPARATOR_SIZES.lightSmall } }
                onDeletePress={ onDelete }
                onEditPress={ () => {} }
            />
        </>
    );
}