import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {DEFAULT_SEPARATOR, FONT_SIZES, SIMPLE_HEADER_HEIGHT} from "../../../constants/constants";
import Picker, {InputPickerDataType} from "../../../components/Input/InputPicker/Picker";
import {SimpleHeaderBar} from "../../../components/Header/HeaderBar";
import Header from "../../../components/Header/Header";
import {Avatar} from "react-native-paper";
import {Input} from "@rneui/themed";
import InputPickerItem from "../../../components/Input/InputPicker/InputPickerItem";
import {theme} from "../../../constants/theme";
import {useDispatch, useSelector} from "react-redux";
import {RootState, store} from "../../../redux/store";
import {loadCars, loadSelectedCar, selectCar} from "../../../redux/reducers/cars.slices";
import {useDatabase} from "../../../db/Database";
import {createSelector} from "@reduxjs/toolkit";

const CarHeader: React.FC = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const selectCarsState = (state: RootState) => state.cars.cars;

    const selectCarsForCarousel = createSelector(
        [selectCarsState],
        (cars) => cars.map((car, index) => ({
            id: index,
            title: car.name,
            subtitle: `${ car.brand }, ${ car.model }`,
        }))
    );

    const cars = useSelector(selectCarsForCarousel);
    const carsIsLoading = useSelector<RootState>(state => state.cars.loading);
    const selectedCarIndex = useSelector<RootState, number>(state => state.cars.selectedCarIndex);

    const onCarSelect = (index: number) => {
        store.dispatch(selectCar(index));
    }

    useEffect(() => {
        store.dispatch(loadSelectedCar({}));
    }, []);

    return (
        <Header
            height={ SIMPLE_HEADER_HEIGHT }
        >
            <Header.StatusBar
                backgroundColor={ theme.colors.black2 }
            />
            <Header.Row paddingRight={!isDropdownVisible ? undefined : 0}>
                <View style={{ flex: 1 }}>
                    {
                        !carsIsLoading &&
                            <Picker
                                data={ cars }
                                selectedItemIndex={ selectedCarIndex }
                                isDropdown={ true }
                                onDropdownToggle={ setIsDropdownVisible }
                                onSelect={ onCarSelect }
                            />
                    }
                </View>
                {
                    !isDropdownVisible &&
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <Avatar.Text label={"UA"} size={FONT_SIZES.large * 1.25} />
                        </View>
                }
            </Header.Row>
        </Header>
    )
}

export default CarHeader;