import { router } from "expo-router";
import useCars from "./useCars.ts";

const useGarage = () => {
    const { cars, loading } = useCars();
    const carCarouselElements = cars.map(car => ({
        id: car.id,
        image: car.image?.image,
        title: car.name,
        subtitle: car.brand,
        body: car.model
    }));

    const openNewCarForm = () => router.push("bottomSheet/createCar");

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