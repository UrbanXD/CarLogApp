import React, { useEffect, useState } from "react";
import { CarouselItemType } from "../../../components/Carousel/Carousel";
import NewCarForm from "../../../features/Form/layouts/car/addCar/NewCarForm";
import { router } from "expo-router";
import useCars from "../../../hooks/useCars";
import { useBottomSheet } from "../../../features/BottomSheet/context/BottomSheetContext.ts";

const useMyGarage = () => {
    const { openBottomSheet } = useBottomSheet();
    const {
        cars,
        carsImage,
        isLoading
    } = useCars();

    const [carouselData, setCarouselData] = useState<CarouselItemType[]>([]);

    const openNewCarForm = () =>
        openBottomSheet({
            title: "Új Autó",
            content:
                <NewCarForm />,
            snapPoints: ["85%"],
            enableDismissOnClose: false
        });

    const openCarProfile= (id: string) => {
        router.push({
            pathname: "(edit)/car",
            params: { id }
        });
    }

    useEffect(() => {
        setCarouselData(
            cars.map(car => {
                return {
                    id: car.id,
                    image: carsImage.find(image => image.path === car.image)?.image || "",
                    title: car.name,
                    subtitle: car.brand,
                    body: car.model,
                };
            })
        );
    }, [cars, carsImage]);

    return {
        cars: carouselData,
        isLoading,
        openNewCarForm,
        openCarProfile,
    }
}

export default useMyGarage;