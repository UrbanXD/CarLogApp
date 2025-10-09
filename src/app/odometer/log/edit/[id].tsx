import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { OdometerLog } from "../../../../features/car/schemas/odometerLogSchema.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { OdometerLogForm } from "../../../../features/car/_features/odometer/components/forms/OdometerLogForm.tsx";

function Page() {
    const { id } = useLocalSearchParams();
    const { odometerLogDao } = useDatabase();
    const { openToast } = useAlert();

    const [odometerLog, setOdometerLog] = useState<OdometerLog | null>(null);

    useEffect(() => {
        if(!id) {
            if(router.canGoBack()) return router.back();
            return router.replace("(main)/index");
        }

        const fetchData = async () => {
            try {
                setOdometerLog(await odometerLogDao.getById(id));
            } catch(e) {
                openToast({ type: "error", title: "not-found" });

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        };

        fetchData();
    }, [id]);

    if(!odometerLog) return <></>;

    const CONTENT = <OdometerLogForm odometerLog={ odometerLog }/>;
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