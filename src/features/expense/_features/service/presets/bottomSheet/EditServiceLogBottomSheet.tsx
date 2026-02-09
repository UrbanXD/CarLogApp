import React, { useMemo } from "react";
import { EditServiceLogForm } from "../../components/forms/EditServiceLogForm.tsx";
import { ServiceLogFormFieldsEnum } from "../../enums/ServiceLogFormFieldsEnum.ts";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useWatchedQueryItem } from "../../../../../../database/hooks/useWatchedQueryItem.ts";
import { useFormBottomSheetGuard } from "../../../../../../hooks/useFormBottomSheetGuard.ts";

export function EditServiceLogBottomSheet() {
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { t } = useTranslation();
    const { serviceLogDao } = useDatabase();

    const memoizedQuery = useMemo(() => serviceLogDao.serviceLogWatchedQueryItem(id), [serviceLogDao, id]);
    const { data: serviceLog, isLoading } = useWatchedQueryItem(memoizedQuery);

    const { fieldValue, isValidField } = useFormBottomSheetGuard({
        data: serviceLog,
        isLoading,
        field,
        enumObject: ServiceLogFormFieldsEnum,
        notFoundText: t("service.log")
    });

    if(!isValidField) return null;

    const CONTENT = serviceLog ? <EditServiceLogForm serviceLog={ serviceLog } field={ fieldValue }/> : null;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}