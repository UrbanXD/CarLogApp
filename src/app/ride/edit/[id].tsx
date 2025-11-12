import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { RideLog } from "../../../features/ride/schemas/rideLogSchema.ts";
import { EditRideLogBottomSheet } from "../../../features/ride/presets/bottomSheet/EditRideLogBottomSheet.tsx";

function Page() {
    const { id, field } = useLocalSearchParams();
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
                openToast({ type: "error", title: "not-found" });

                if(router.canGoBack()) return router.back();
                router.replace("(workbook)/index");
            }
        })();
    }, [id, field]);

    if(!rideLog || !field) return <></>;

    return <EditRideLogBottomSheet rideLog={ rideLog } field={ field }/>;
}

export default Page;