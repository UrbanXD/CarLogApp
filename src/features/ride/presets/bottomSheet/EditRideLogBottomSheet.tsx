import React, { useMemo } from "react";
import { EditRideLogForm } from "../../components/forms/EditRideLogForm.tsx";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { RideLogFormFieldsEnum } from "../../enums/RideLogFormFields.ts";
import { useWatchedQueryItem } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { useFormBottomSheetGuard } from "../../../../hooks/useFormBottomSheetGuard.ts";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";

export function EditRideLogBottomSheet() {
    const { t } = useTranslation();
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { rideLogDao } = useDatabase();

    const memoizedQuery = useMemo(() => rideLogDao.rideLogWatchedQueryItem(id), [rideLogDao, id]);
    const { data: rideLog, isLoading } = useWatchedQueryItem(memoizedQuery);

    const { fieldValue, isValidField } = useFormBottomSheetGuard({
        data: rideLog,
        isLoading,
        field,
        enumObject: RideLogFormFieldsEnum,
        notFoundText: t("rides.log")
    });

    if(!isValidField) return null;

    const CONTENT = rideLog ? <EditRideLogForm rideLog={ rideLog } field={ fieldValue }/> : null;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}