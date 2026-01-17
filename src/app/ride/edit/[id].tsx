import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { RideLog } from "../../../features/ride/schemas/rideLogSchema.ts";
import { EditRideLogBottomSheet } from "../../../features/ride/presets/bottomSheet/EditRideLogBottomSheet.tsx";
import { NotFoundToast } from "../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { RideLogFormFieldsEnum } from "../../../features/ride/enums/RideLogFormFields.ts";

function Page() {
    const { t } = useTranslation();
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { rideLogDao } = useDatabase();
    const { openToast } = useAlert();

    const [rideLog, setRideLog] = useState<RideLog | null>(null);

    useEffect(() => {
        (async () => {
            if(!id || !field) {
                if(router.canGoBack()) return router.back();
                return router.replace("(workbook)/index");
            }

            try {
                setRideLog(await rideLogDao.getById(id));
            } catch(e) {
                openToast(NotFoundToast.warning(t("rides.log")));

                if(router.canGoBack()) return router.back();
                router.replace("(workbook)/index");
            }
        })();
    }, [id, field]);

    if(!rideLog || !field || isNaN(Number(field))) return <></>;

    return <EditRideLogBottomSheet rideLog={ rideLog } field={ Number(field) as RideLogFormFieldsEnum }/>;
}

export default Page;