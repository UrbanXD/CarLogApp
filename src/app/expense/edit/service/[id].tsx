import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { ServiceLog } from "../../../../features/expense/_features/service/schemas/serviceLogSchema.ts";
import {
    EditServiceLogBottomSheet
} from "../../../../features/expense/_features/service/presets/bottomSheet/EditServiceLogBottomSheet.tsx";
import { NotFoundToast } from "../../../../ui/alert/presets/toast/index.ts";
import {
    ServiceLogFormFieldsEnum
} from "../../../../features/expense/_features/service/enums/ServiceLogFormFieldsEnum.ts";
import { useTranslation } from "react-i18next";

function Page() {
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { t } = useTranslation();
    const { serviceLogDao } = useDatabase();
    const { openToast } = useAlert();

    const [serviceLog, setServiceLog] = useState<ServiceLog | null>(null);

    useEffect(() => {
        (async () => {
            if(!id || !field) {
                if(router.canGoBack()) return router.back();
                return router.replace("(main)/index");
            }

            try {
                setServiceLog(await serviceLogDao.getById(id));
            } catch(e) {
                openToast(NotFoundToast.warning(t("service.log")));

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        })();
    }, [id, field]);

    const fieldIndex = field ? Number(field) : NaN;
    const isValidField = !isNaN(fieldIndex) && fieldIndex in ServiceLogFormFieldsEnum;
    if(!serviceLog || !isValidField) return null;

    return <EditServiceLogBottomSheet serviceLog={ serviceLog } field={ fieldIndex }/>;
}

export default Page;