import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { Expense } from "../../../features/expense/schemas/expenseSchema.ts";
import { EditExpenseForm } from "../../../features/expense/components/forms/EditExpenseForm.tsx";
import { NotFoundToast } from "../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

function Page() {
    const { t } = useTranslation();
    const { id, field } = useLocalSearchParams();
    const { expenseDao } = useDatabase();
    const { openToast } = useAlert();

    const [expense, setExpense] = useState<Expense | null>(null);

    useEffect(() => {
        (async () => {
            if(!id) {
                if(router.canGoBack()) return router.back();
                return router.replace("(main)/index");
            }

            try {
                const expenseResult = await expenseDao.getById(id);
                setExpense(expenseResult);
            } catch(e) {
                openToast(NotFoundToast.warning(t("expenses.title_singular")));

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        })();
    }, [id]);

    if(!expense) return <></>;

    return (
        <FormBottomSheet
            content={ <EditExpenseForm expense={ expense } field={ field }/> }
            enableDynamicSizing
        />
    );
}

export default Page;