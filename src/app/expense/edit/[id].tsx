import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../ui/bottomSheet/components/BottomSheet.tsx";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { Expense } from "../../../features/expense/schemas/expenseSchema.ts";
import { EditExpenseForm } from "../../../features/expense/components/forms/EditExpenseForm.tsx";

function Page() {
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
                openToast({ type: "error", title: "not-found" });

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        })();
    }, [id]);

    if(!expense) return <></>;

    const CONTENT = <EditExpenseForm expense={ expense } field={ field }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            enableOverDrag={ false }
        />
    );
}

export default Page;