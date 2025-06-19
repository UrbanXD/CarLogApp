import React, { useEffect, useState } from "react";
import { CarouselItemType } from "../../../components/Carousel/Carousel";
import NewCarForm from "../../../features/car/components/forms/NewCarForm.tsx";
import { router } from "expo-router";
import useCars from "../../../features/car/hooks/useCars.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import {CarCreateBottomSheet} from "../../../features/car/presets/bottomSheet/index.ts";

const useMyGarage = () => {
    const { openBottomSheet } = useBottomSheet();
    const { cars, loading } = useCars();

    const [carouselData, setCarouselData] = useState<CarouselItemType[]>([]);

    const openNewCarForm = () => openBottomSheet(CarCreateBottomSheet);

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
                    image: car.image?.image || "",
                    title: car.name,
                    subtitle: car.brand,
                    body: car.model,
                };
            })
        );
    }, [cars]);

    return {
        cars: carouselData,
        loading,
        openNewCarForm,
        openCarProfile,
    }
}

export default useMyGarage;