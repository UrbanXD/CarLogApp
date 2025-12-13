import useCars from "../../features/car/hooks/useCars.ts";
import { ScreenScrollView } from "../../components/screenView/ScreenScrollView.tsx";
import { RideLogTimeline } from "../../features/ride/components/RideLogTimeline.tsx";
import { FirstSelectCar } from "../../components/firstSelectCar/FirstSelectCar.tsx";

export function RideTimelineScreen() {
    const { selectedCar } = useCars();

    if(!selectedCar) return <FirstSelectCar/>;

    return (
        <ScreenScrollView>
            <RideLogTimeline car={ selectedCar }/>
        </ScreenScrollView>
    );
}