import { useTimelinePaginator } from "../../hooks/useTimelinePaginator.ts";
import { PassengerTableRow } from "../../database/connector/powersync/AppSchema.ts";
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

export function PassengerScreen() {
    const { t } = useTranslation();
    const { passengerDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const user = useAppSelector(getUser);

    if(!user) return <></>;

    const paginator = useMemo(() => passengerDao.paginator(), []);

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
    } = useTimelinePaginator<PassengerTableRow, PickerItemType, InfoTimelineItem>({
        paginator,
        mapper
    });

    const openCreateForm = () => router.push("/ride/passenger/create");

    const onEdit = (id: string, callback?: () => void) => {
        if(!id) return;

        callback?.();
        router.push({
            pathname: "/ride/passenger/edit/[id]",
            params: { id }
        });
    };

    const handleDelete = useCallback(async (id: string, callback?: () => void) => {
        try {
            await passengerDao.delete(id);

            openToast(DeleteExpenseToast.success());
            callback?.();
            await refresh();
            requestAnimationFrame(() => {
                ref.current?.clearLayoutCacheOnUpdate();
            });
        } catch(e) {
            console.log(e);
            openToast(DeleteExpenseToast.error());
        }
    }, [passengerDao]);

    const onDelete = useCallback((id: string) => {
        openModal({
            title: t("passengers.modal.delete"),
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