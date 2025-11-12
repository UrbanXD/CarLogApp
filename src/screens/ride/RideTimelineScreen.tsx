import useCars from "../../features/car/hooks/useCars.ts";
import { ScreenScrollView } from "../../components/screenView/ScreenScrollView.tsx";
import { RideLogTimeline } from "../../features/ride/components/RideLogTimeline.tsx";

export function RideTimelineScreen() {
    const { selectedCar } = useCars();

    if(!selectedCar) return <></>;

    return (
        <ScreenScrollView>
            <RideLogTimeline car={ selectedCar }/>
        </ScreenScrollView>
    );
}