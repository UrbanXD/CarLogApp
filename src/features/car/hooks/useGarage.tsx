import { router } from "expo-router";
import useCars from "./useCars.ts";
import { Car } from "../schemas/carSchema.ts";
import { CarouselItemType } from "../../../components/Carousel/Carousel.tsx";

const useGarage = () => {
    const { cars, loading } = useCars();

    const toCarouselItem = (car: Car): CarouselItemType => ({
        id: car.id,
        image: car.imagePath,
        title: car.name,
        subtitle: car.model.make.name,
        body: car.model.name
    });

    const openNewCarForm = () => router.push("car/create");

    const openCarProfile = (id: string) => router.push({ pathname: "(edit)/car", params: { id } });

    return { cars: cars.map(toCarouselItem), loading, openNewCarForm, openCarProfile };
};

export default useGarage;