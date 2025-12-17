import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { FuelLog } from "../../../../features/car/_features/fuel/schemas/fuelLogSchema.ts";
import { EditFuelLogForm } from "../../../../features/car/_features/fuel/components/forms/EditFuelLogForm.tsx";
import { NotFoundToast } from "../../../../ui/alert/presets/toast/index.ts";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

function Page() {
    const { id, field } = useLocalSearchParams();
    const { fuelLogDao } = useDatabase();
    const { openToast } = useAlert();

    const [fuelLog, setFuelLog] = useState<FuelLog | null>(null);

    useEffect(() => {
        (async () => {
            if(!id) {
                if(router.canGoBack()) return router.back();
                return router.replace("(main)/index");
            }

            try {
                setFuelLog(await fuelLogDao.getById(id));
            } catch(e) {
                openToast(NotFoundToast.warning(t("fuel.log")));

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        })();
    }, [id]);

    if(!fuelLog) return <></>;

    const CONTENT = <EditFuelLogForm fuelLog={ fuelLog } field={ field }/>;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
        />
    );
}

export default Page;