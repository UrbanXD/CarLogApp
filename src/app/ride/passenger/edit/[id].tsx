import { router, useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import React, { useEffect, useState } from "react";
import { Passenger } from "../../../../features/ride/_features/passenger/schemas/passengerSchema.ts";
import {
    PassengerBottomSheet
} from "../../../../features/ride/_features/passenger/presets/bottomSheet/PassengerBottomSheet.tsx";

function Page() {
    const { id } = useLocalSearchParams();
    const { passengerDao } = useDatabase();
    const { openToast } = useAlert();

    const [passenger, setPassenger] = useState<Passenger | null>(null);

    useEffect(() => {
        (async () => {
            if(!id) {
                if(router.canGoBack()) return router.back();
                return router.replace("(main)/index");
            }

            try {
                setPassenger(await passengerDao.getById(id));
            } catch(e) {
                openToast({ type: "error", title: "not-found" });

                if(router.canGoBack()) return router.back();
                router.replace("(main)/index");
            }
        })();
    }, [id]);

    if(!passenger) return <></>;

    return <PassengerBottomSheet passenger={ passenger }/>;
}

export default Page;