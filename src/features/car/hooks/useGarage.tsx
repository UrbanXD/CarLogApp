import { router } from "expo-router";
import useCars from "./useCars.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { CarCreateBottomSheet } from "../presets/bottomSheet/index.ts";

const useGarage = () => {
    const { openBottomSheet } = useBottomSheet();
    const { cars, loading } = useCars();
    const carCarouselElements = cars.map(car => ({
        id: car.id,
        image: car.image?.image,
        title: car.name,
        subtitle: car.brand,
        body: car.model
    }));

    const openNewCarForm = () => openBottomSheet(CarCreateBottomSheet);

    const openCarProfile = (id: string) => {
        router.push({
            pathname: "(edit)/car",
            params: { id }
        });
    };

    return {
        cars: carCarouselElements,
        loading,
        openNewCarForm,
        openCarProfile
    };
};

export default useGarage;