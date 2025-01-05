import {useBottomSheet} from "../../../BottomSheet/context/BottomSheetProvider";
import {RootState} from "../../../Database/redux/store";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {CarouselItemType} from "../../../Carousel/components/Carousel";
import NewCarForm from "../../../Form/layouts/car/addCar/NewCarForm";
import {router} from "expo-router";

const useMyGarage = () => {
    const { openBottomSheet, forceCloseBottomSheet } = useBottomSheet();

    const selectCarsState = (state: RootState) => state.cars.cars;
    const selectCarsImageState = (state: RootState) => state.cars.carsImage;
    const loadingState = (state: RootState) => state.cars.loading;
    const isLoading = useSelector(loadingState);

    const cars = useSelector(selectCarsState);
    const carsImage = useSelector(selectCarsImageState);
    const [carouselData, setCarouselData] = useState<CarouselItemType[]>([]);

    const getCar = (id: string) =>
        cars.find(car => car.id === id);

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
        getCar,
        openNewCarBottomSheet,
        openCarProfile,
    }
}

export default useMyGarage;