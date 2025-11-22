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
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { useTranslation } from "react-i18next";
import { DeleteToast, NotFoundToast } from "../../ui/alert/presets/toast/index.ts";
import { DeleteModal } from "../../ui/alert/presets/modal/index.ts";

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
        if(!id) return openToast(NotFoundToast.warning(t("passengers.title_singular")));

        callback?.();
        router.push({
            pathname: "/ride/passenger/edit/[id]",
            params: { id }
        });
    };

    const handleDelete = useCallback(async (id: string, callback?: () => void) => {
        if(!id) return openToast(NotFoundToast.warning(t("passengers.title_singular")));

        try {
            await passengerDao.delete(id);

            openToast(DeleteToast.success(t("passengers.title_singular")));
            callback?.();
            await refresh();
            requestAnimationFrame(() => {
                ref.current?.clearLayoutCacheOnUpdate();
            });
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("passengers.title_singular")));
        }
    }, [passengerDao]);

    const onDelete = useCallback((id: string, callback?: () => void) => {
        openModal(DeleteModal({
            name: t("passengers.title_singular"),
            acceptAction: () => handleDelete(id, callback)
        }));
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