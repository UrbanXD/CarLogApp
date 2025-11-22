import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { FuelLog } from "../../../../features/car/_features/fuel/schemas/fuelLogSchema.ts";
import { EditFuelLogForm } from "../../../../features/car/_features/fuel/components/forms/EditFuelLogForm.tsx";
import { NotFoundToast } from "../../../../ui/alert/presets/toast/index.ts";

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