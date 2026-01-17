import { useTimelinePaginator } from "../../hooks/useTimelinePaginator.ts";
import { PassengerTableRow } from "../../database/connector/powersync/AppSchema.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "../../hooks/index.ts";
import { getUser } from "../../features/user/model/selectors/index.ts";
import { InfoTimeline, InfoTimelineItem } from "../../components/info/InfoTimeline.tsx";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";
import { router } from "expo-router";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { useTranslation } from "react-i18next";
import { DeleteToast, NotFoundToast } from "../../ui/alert/presets/toast/index.ts";
import { DeleteModal } from "../../ui/alert/presets/modal/index.ts";
import { Passenger } from "../../features/ride/_features/passenger/schemas/passengerSchema.ts";

export function PassengerScreen() {
    const { t } = useTranslation();
    const { passengerDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const user = useAppSelector(getUser);

    if(!user) return <></>;

    const paginator = useMemo(() => passengerDao.paginator(), []);

    const mapper = useCallback((item: Passenger, callback?: () => void): InfoTimelineItem => {
        return {
            id: item.id,
            text: item.name,
            callback: callback
        };
    }, []);

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
    } = useTimelinePaginator<PassengerTableRow, Passenger, InfoTimelineItem>({
        paginator,
        mapper
    });

    const openCreateForm = () => router.push("/ride/passenger/create");

    const onEdit = useCallback((id: string | number, callback?: () => void) => {
        if(!id) return openToast(NotFoundToast.warning(t("passengers.title_singular")));

        callback?.();
        router.push({
            pathname: "/ride/passenger/edit/[id]",
            params: { id }
        });
    }, [openToast, t]);

    const handleDelete = useCallback(async (id: string | number, callback?: () => void) => {
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
    }, [passengerDao, openToast, t]);

    const onDelete = useCallback((id: string | number, callback?: () => void) => {
        openModal(DeleteModal({
            name: t("passengers.title_singular"),
            acceptAction: () => handleDelete(id, callback)
        }));
    }, [openModal, t]);

    return (
        <ScreenView>
            <InfoTimeline
                ref={ ref }
                data={ data }
                openCreateForm={ openCreateForm }
                onEdit={ onEdit }
                onDelete={ onDelete }
                isInitialFetching={ isInitialFetching }
                fetchNext={ (initialFetchHappened && paginator.hasNext()) ? fetchNext : undefined }
                fetchPrevious={ (initialFetchHappened && paginator.hasPrevious()) ? fetchPrevious : undefined }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
            />
        </ScreenView>
    );
}