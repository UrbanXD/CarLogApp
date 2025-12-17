import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { EditOdometerChangeLogForm } from "../../components/forms/EditOdometerChangeLogForm.tsx";
import { NotFoundToast } from "../../../../../../ui/alert/presets/toast/index.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function EditOdometerLogBottomSheet() {
    const { t } = useTranslation();
    const { id, field } = useLocalSearchParams();
    const { odometerLogDao } = useDatabase();
    const { openToast } = useAlert();

    const [odometerLog, setOdometerLog] = useState<OdometerLog | null>(null);

    useEffect(() => {
        (async () => {
            if(!id) {
                if(router.canGoBack()) return router.back();
                return router.replace("(main)/index");
            }

            try {
                setOdometerLog(await odometerLogDao.getById(id));
            } catch(e) {
                openToast(NotFoundToast.warning(t("odometer.log")));

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        })();
    }, [id]);

    if(!odometerLog) return <></>;

    const CONTENT = <EditOdometerChangeLogForm odometerLog={ odometerLog } field={ field }/>;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
        />
    );
}