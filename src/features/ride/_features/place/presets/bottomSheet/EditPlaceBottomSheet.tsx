import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import { useWatchedQueryItem } from "../../../../../../database/hooks/useWatchedQueryItem.ts";
import { useFormBottomSheetGuard } from "../../../../../../hooks/useFormBottomSheetGuard.ts";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { EditPlaceForm } from "../../components/forms/EditPlaceForm.tsx";

export function EditPlaceBottomSheet() {
    const { id } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { t } = useTranslation();
    const { placeDao } = useDatabase();

    const memoizedQuery = useMemo(() => placeDao.watchedQueryItem(id), [placeDao, id]);
    const { data: place, isLoading } = useWatchedQueryItem(memoizedQuery);

    useFormBottomSheetGuard({
        data: place,
        isLoading,
        notFoundText: t("places.title_singular")
    });

    const CONTENT = place ? <EditPlaceForm place={ place }/> : null;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}