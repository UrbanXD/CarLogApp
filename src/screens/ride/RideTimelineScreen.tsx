import { ScreenScrollView } from "../../components/screenView/ScreenScrollView.tsx";
import { RideLogTimeline } from "../../features/ride/components/RideLogTimeline.tsx";
import { FirstSelectCar } from "../../components/firstSelectCar/FirstSelectCar.tsx";
import { useSelectedCarId } from "../../features/car/hooks/useSelectedCarId.ts";

export function RideTimelineScreen() {
    const { selectedCarId } = useSelectedCarId();

    if(!selectedCarId) return <FirstSelectCar/>;

    return (
        <ScreenScrollView>
            <RideLogTimeline carId={ selectedCarId }/>
        </ScreenScrollView>
    );
}