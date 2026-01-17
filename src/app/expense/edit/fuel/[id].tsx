import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { FuelLog } from "../../../../features/car/_features/fuel/schemas/fuelLogSchema.ts";
import { EditFuelLogForm } from "../../../../features/car/_features/fuel/components/forms/EditFuelLogForm.tsx";
import { NotFoundToast } from "../../../../ui/alert/presets/toast/index.ts";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useTranslation } from "react-i18next";
import {
    ServiceLogFormFieldsEnum
} from "../../../../features/expense/_features/service/enums/ServiceLogFormFieldsEnum.ts";

function Page() {
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { t } = useTranslation();
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

    const fieldIndex = field ? Number(field) : NaN;
    const isValidField = !isNaN(fieldIndex) && fieldIndex in ServiceLogFormFieldsEnum;
    if(!fuelLog || !isValidField) return null;

    const CONTENT = <EditFuelLogForm fuelLog={ fuelLog } field={ fieldIndex }/>;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
        />
    );
}

export default Page;