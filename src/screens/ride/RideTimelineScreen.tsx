import { RideLogTimeline } from "../../features/ride/components/RideLogTimeline.tsx";
import { FirstSelectCar } from "../../components/firstSelectCar/FirstSelectCar.tsx";
import { useSelectedCarId } from "../../features/car/hooks/useSelectedCarId.ts";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";

export function RideTimelineScreen() {
    const { selectedCarId } = useSelectedCarId();

    if(!selectedCarId) return <FirstSelectCar/>;

    return (
        <ScreenView>
            <RideLogTimeline carId={ selectedCarId }/>
        </ScreenView>
    );
}