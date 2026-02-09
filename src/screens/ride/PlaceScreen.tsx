import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { useCallback, useMemo } from "react";
import { InfoTimeline, InfoTimelineItem } from "../../components/info/InfoTimeline.tsx";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";
import { router } from "expo-router";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "../../ui/alert/presets/modal";
import { DeleteToast, NotFoundToast } from "../../ui/alert/presets/toast";
import { useAuth } from "../../contexts/auth/AuthContext.ts";
import { useTimeline } from "../../hooks/useTimeline.ts";

export function PlaceScreen() {
    const { t } = useTranslation();
    const { placeDao } = useDatabase();
    const { openModal, openToast } = useAlert();
    const { sessionUserId } = useAuth();


    const memoizedOptions = useMemo(
        () => placeDao.timelineInfiniteQuery(sessionUserId),
        [placeDao, sessionUserId]
    );

    const {
        data,
        fetchNext,
        fetchPrev,
        isNextFetching,
        isPrevFetching,
        hasNext,
        hasPrev,
        isLoading
    } = useTimeline({ infiniteQueryOptions: memoizedOptions });

    const openCreateForm = () => router.push("/ride/place/create");

    const onEdit = useCallback((id: string | number) => {
        if(!id) return openToast(NotFoundToast.warning(t("places.title_singular")));

        router.push({
            pathname: "/ride/place/edit/[id]",
            params: { id }
        });
    }, [openToast, t]);

    const handleDelete = useCallback(async (id: string | number) => {
        if(!id) return openToast(NotFoundToast.warning(t("places.title_singular")));

        try {
            await placeDao.delete(id);

            openToast(DeleteToast.success(t("places.title_singular")));
        } catch(e) {
            console.log(e);
            openToast(DeleteToast.error(t("places.title_singular")));
        }
    }, [placeDao, openToast, t]);

    const onDelete = useCallback((id: string | number) => {
        openModal(DeleteModal({ name: t("places.title_singular"), acceptAction: () => handleDelete(id) }));
    }, [openModal, t]);

    const memoizedData = useMemo(() => data.map((row) => ({
        id: row.id,
        text: row.name
    }) as InfoTimelineItem), [data]);

    return (
        <ScreenView>
            <InfoTimeline
                data={ memoizedData }
                openCreateForm={ openCreateForm }
                onEdit={ onEdit }
                onDelete={ onDelete }
                isLoading={ isLoading }
                fetchNext={ fetchNext }
                fetchPrev={ fetchPrev }
                isNextFetching={ isNextFetching }
                isPrevFetching={ isPrevFetching }
                hasNext={ hasNext }
                hasPrev={ hasPrev }
            />
        </ScreenView>
    );
}