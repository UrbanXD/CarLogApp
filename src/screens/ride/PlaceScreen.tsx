import { useTimelinePaginator } from "../../hooks/useTimelinePaginator.ts";
import { PlaceTableRow } from "../../database/connector/powersync/AppSchema.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "../../hooks/index.ts";
import { getUser } from "../../features/user/model/selectors/index.ts";
import { InfoTimeline, InfoTimelineItem } from "../../components/info/InfoTimeline.tsx";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";
import { router } from "expo-router";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "../../ui/alert/presets/modal/index.ts";
import { DeleteToast, NotFoundToast } from "../../ui/alert/presets/toast/index.ts";
import { Place } from "../../features/ride/_features/place/schemas/placeSchema.ts";

export function PlaceScreen() {
    const { t } = useTranslation();
    const { placeDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const user = useAppSelector(getUser);

    if(!user) return <></>;

    const paginator = useMemo(() => placeDao.paginator(), []);

    const mapper = useCallback((item: Place, callback?: () => void): InfoTimelineItem => {
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
    } = useTimelinePaginator<PlaceTableRow, Place, InfoTimelineItem>({
        paginator,
        mapper
    });

    const openCreateForm = () => router.push("/ride/place/create");

    const onEdit = useCallback((id: string, callback?: () => void) => {
        if(!id) return openToast(NotFoundToast.warning(t("places.title_singular")));

        callback?.();
        router.push({
            pathname: "/ride/place/edit/[id]",
            params: { id }
        });
    }, []);

    const handleDelete = useCallback(async (id: string, callback?: () => void) => {
        if(!id) return openToast(NotFoundToast.warning(t("places.title_singular")));

        try {
            await placeDao.delete(id);

            openToast(DeleteToast.success(t("places.title_singular")));
            callback?.();
            await refresh();
            requestAnimationFrame(() => {
                ref.current?.clearLayoutCacheOnUpdate();
            });
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("places.title_singular")));
        }
    }, [placeDao, openToast, t]);

    const onDelete = useCallback((id: string, callback?: () => void) => {
        openModal(DeleteModal({ name: t("places.title_singular"), acceptAction: () => handleDelete(id, callback) }));
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
                fetchNext={ initialFetchHappened && paginator.hasNext() && fetchNext }
                fetchPrevious={ initialFetchHappened && paginator.hasPrevious() && fetchPrevious }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
            />
        </ScreenView>
    );
}