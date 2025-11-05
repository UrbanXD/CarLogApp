import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { Place } from "../../../../features/ride/_features/place/schemas/placeSchema.ts";
import { PlaceBottomSheet } from "../../../../features/ride/_features/place/presets/bottomSheet/PlaceBottomSheet.tsx";

function Page() {
    const { id } = useLocalSearchParams();
    const { placeDao } = useDatabase();
    const { openToast } = useAlert();

    const [place, setPlace] = useState<Place | null>(null);

    useEffect(() => {
        (async () => {
            if(!id) {
                if(router.canGoBack()) return router.back();
                return router.replace("(main)/index");
            }

            try {
                setPlace(await placeDao.getById(id));
            } catch(e) {
                openToast({ type: "error", title: "not-found" });

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        })();
    }, [id]);

    if(!place) return <></>;

    return <PlaceBottomSheet place={ place }/>;
}

export default Page;