import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import { useWatchedQueryItem } from "../../../../../../database/hooks/useWatchedQueryItem.ts";
import { useFormBottomSheetGuard } from "../../../../../../hooks/useFormBottomSheetGuard.ts";
import { EditPassengerForm } from "../../components/forms/EditPassengerForm.tsx";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function EditPassengerBottomSheet() {
    const { id } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { t } = useTranslation();
    const { passengerDao } = useDatabase();

    const memoizedQuery = useMemo(() => passengerDao.watchedQueryItem(id), [passengerDao, id]);
    const { data: passenger, isLoading } = useWatchedQueryItem(memoizedQuery);

    useFormBottomSheetGuard({
        data: passenger,
        isLoading,
        notFoundText: t("passengers.title_singular")
    });

    const CONTENT = passenger ? <EditPassengerForm passenger={ passenger }/> : null;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}