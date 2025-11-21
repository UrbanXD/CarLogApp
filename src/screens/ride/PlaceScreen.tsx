import { useTimelinePaginator } from "../../hooks/useTimelinePaginator.ts";
import { PlaceTableRow } from "../../database/connector/powersync/AppSchema.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "../../hooks/index.ts";
import { getUser } from "../../features/user/model/selectors/index.ts";
import { InfoTimeline, InfoTimelineItem } from "../../components/info/InfoTimeline.tsx";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";
import { PickerItemType } from "../../components/Input/picker/PickerItem.tsx";
import { router } from "expo-router";
import { DeleteExpenseToast } from "../../features/expense/presets/toasts/DeleteExpenseToast.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { useTranslation } from "react-i18next";

export function PlaceScreen() {
    const { t } = useTranslation();
    const { placeDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const user = useAppSelector(getUser);

    if(!user) return <></>;

    const paginator = useMemo(
        () => placeDao.paginator(),
        []
    );

    const mapper = (item: PickerItemType, callback?: () => void): InfoTimelineItem => {
        return ({
            id: item.value,
            text: item.title,
            callback: callback
        });
    };

    const {
        ref,
        data,
        initialFetchHappened,
        isInitialFetching,
        refresh,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching
    } = useTimelinePaginator<PlaceTableRow, PickerItemType, InfoTimelineItem>({
        paginator,
        mapper
    });

    const openCreateForm = () => router.push("/ride/place/create");

    const onEdit = (id: string, callback?: () => void) => {
        if(!id) return;
        console.log(!!callback, "hi");

        callback?.();
        router.push({
            pathname: "/ride/place/edit/[id]",
            params: { id }
        });
    };

    const handleDelete = useCallback(async (id: string, callback?: () => void) => {
        try {
            await placeDao.delete(id);

            openToast(DeleteExpenseToast.success());
            callback?.();
            await refresh();
            requestAnimationFrame(() => {
                ref.current?.clearLayoutCacheOnUpdate(); // vagy adott kezdő index
            });
        } catch(e) {
            console.log(e);
            openToast(DeleteExpenseToast.error());
        }
    }, [placeDao]);

    const onDelete = useCallback((id: string) => {
        openModal({
            title: t("places.modal.delete"),
            body: t("modal.delete_message"),
            acceptText: t("form_button.delete"),
            acceptAction: () => handleDelete(id)
        });
    }, [openToast, openModal]);

    return (
        <ScreenView>
            <InfoTimeline
                ref={ ref }
                data={ data }
                openCreateForm={ openCreateForm }
                onEdit={ onEdit }
                onDelete={ onDelete }
                isInitialFetching={ isInitialFetching }
                fetchNext={ initialFetchHappened && paginator.hasNext() && fetchNext }
                fetchPrevious={ initialFetchHappened && paginator.hasPrevious() && fetchPrevious }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
            />
        </ScreenView>
    );
}