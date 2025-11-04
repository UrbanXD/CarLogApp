import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useCars from "../../../features/car/hooks/useCars.ts";
import EditCarForm from "../../../features/car/components/forms/EditCarForm.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../ui/bottomSheet/components/BottomSheet.tsx";

function Page() {
    const { id, stepIndex } = useLocalSearchParams();
    const { getCar } = useCars();

    const car = getCar(id);

    useEffect(() => {
        if(car) return;

        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }, [car]);

    if(!car) return <></>;

    const CONTENT = <EditCarForm car={ car } stepIndex={ stepIndex }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            enableOverDrag={ false }
        />
    );
}

export default Page;