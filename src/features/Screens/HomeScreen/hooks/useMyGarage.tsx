import {useBottomSheet} from "../../../BottomSheet/context/BottomSheetProvider";
import {RootState} from "../../../Database/redux/store";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {CarouselItemType} from "../../../Carousel/components/Carousel";
import NewCarForm from "../../../Form/layouts/addCar/NewCarForm";
import {Alert} from "react-native";
import CarInfo from "../../../carInfo/CarInfo";

const useMyGarage = () => {
    const { openBottomSheet, forceCloseBottomSheet } = useBottomSheet();

    const selectCarsState = (state: RootState) => state.cars.cars;
    const loadingState = (state: RootState) => state.cars.loading;
    const isLoading = useSelector(loadingState);

    const cars = useSelector(selectCarsState);
    const [carouselData, setCarouselData] = useState<CarouselItemType[]>([]);

    const openNewCarBottomSheet = () =>
        openBottomSheet({
            title: "Új Autó",
            content: <NewCarForm close={ forceCloseBottomSheet } />,
            snapPoints: ["85%"],
            enableDismissOnClose: false
        });

    const openCarInfoBottomSheet = (index: number) => {
        const car = cars.find(car => car .id === cars[index].id);

        if(!car) return Alert.alert('Nincs auto');

        openBottomSheet({
            title: carouselData[index].id || index.toString(),
            content: <CarInfo car={ car } />,
            snapPoints: ["85%"]
        });
    }

    useEffect(() => {
        setCarouselData(
            cars.map(car => {
                return {
                    id: car.name,
                    image: car.image,
                    title: car.brand,
                    subtitle: car.model,
                } as CarouselItemType;
            })
        );
    }, [cars]);

    return {
        cars: carouselData,
        isLoading,
        openNewCarBottomSheet,
        openCarInfoBottomSheet,
    }
}

export default useMyGarage;