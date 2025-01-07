import {useBottomSheet} from "../../../BottomSheet/context/BottomSheetProvider";
import {RootState} from "../../../Database/redux/store";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {CarouselItemType} from "../../../Carousel/components/Carousel";
import NewCarForm from "../../../Form/layouts/car/addCar/NewCarForm";
import {router} from "expo-router";
import useCars from "../../../Shared/hooks/useCars";

const useMyGarage = () => {
    const { openBottomSheet, forceCloseBottomSheet } = useBottomSheet();
    const {
        cars,
        carsImage,
        isLoading
    } = useCars();

    const [carouselData, setCarouselData] = useState<CarouselItemType[]>([]);

    const openNewCarBottomSheet = () =>
        openBottomSheet({
            title: "Új Autó",
            content:
                <NewCarForm
                    forceCloseBottomSheet={ forceCloseBottomSheet }
                />,
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
        openNewCarBottomSheet,
        openCarProfile,
    }
}

export default useMyGarage;