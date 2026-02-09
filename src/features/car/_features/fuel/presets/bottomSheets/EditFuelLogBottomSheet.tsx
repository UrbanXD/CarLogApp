import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import { useWatchedQueryItem } from "../../../../../../database/hooks/useWatchedQueryItem.ts";
import { useFormBottomSheetGuard } from "../../../../../../hooks/useFormBottomSheetGuard.ts";
import { FuelLogFormFieldsEnum } from "../../enums/fuelLogFormFields.tsx";
import { EditFuelLogForm } from "../../components/forms/EditFuelLogForm.tsx";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function EditFuelLogBottomSheet() {
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { t } = useTranslation();
    const { fuelLogDao } = useDatabase();

    const memoizedQuery = useMemo(() => fuelLogDao.fuelLogWatchedQueryItem(id), [fuelLogDao, id]);
    const { data: fuelLog, isLoading } = useWatchedQueryItem(memoizedQuery);

    const { fieldValue, isValidField } = useFormBottomSheetGuard({
        data: fuelLog,
        isLoading,
        field,
        enumObject: FuelLogFormFieldsEnum,
        notFoundText: t("fuel.log")
    });

    if(!isValidField) return null;

    const CONTENT = fuelLog ? <EditFuelLogForm fuelLog={ fuelLog } field={ fieldValue }/> : null;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}