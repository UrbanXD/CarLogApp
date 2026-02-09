import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { EditOdometerChangeLogForm } from "../../components/forms/EditOdometerChangeLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useWatchedQueryItem } from "../../../../../../database/hooks/useWatchedQueryItem.ts";
import { useFormBottomSheetGuard } from "../../../../../../hooks/useFormBottomSheetGuard.ts";
import { OdometerLogFormFieldsEnum } from "../../enums/odometerLogFormFields.ts";

export function EditOdometerLogBottomSheet() {
    const { t } = useTranslation();
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { odometerLogDao } = useDatabase();

    const memoizedQuery = useMemo(() => odometerLogDao.odometerLogWatchedQueryItem(id), [odometerLogDao, id]);
    const { data: odometerLog, isLoading } = useWatchedQueryItem(memoizedQuery);

    const { fieldValue, isValidField } = useFormBottomSheetGuard({
        data: odometerLog,
        isLoading,
        field,
        isFieldNullable: true,
        enumObject: OdometerLogFormFieldsEnum,
        notFoundText: t("odometer.log")
    });

    if(!isValidField) return null;

    const CONTENT = odometerLog ? <EditOdometerChangeLogForm odometerLog={ odometerLog } field={ fieldValue }/> : null;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}