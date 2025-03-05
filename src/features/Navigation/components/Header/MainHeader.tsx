import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { GLOBAL_STYLE, SIMPLE_HEADER_HEIGHT } from "../../../../constants/constants";
import Picker, {PickerDataType} from "../../../Form/components/Input/picker/Picker";
import { useSelector } from "react-redux";
import { store } from "../../../Database/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "../../../../components/Avatar/Avatar";
import { loadSelectedCar } from "../../../Database/redux/cars/functions/loadSelectedCar";
import { selectCar } from "../../../Database/redux/cars/functions/selectCar";
import useHeaderStyles from "../../hooks/useHeaderStyles";
import { router } from "expo-router";
import { RootState } from "../../../Database/redux";
import { useSession } from "../../../Auth/context/SessionProvider.tsx";
import { getLabelByName } from "../../../../utils/getLabelByName.ts";

const MainHeader: React.FC = () => {
    const { session } = useSession();
    const { top } = useSafeAreaInsets();
    const styles = useHeaderStyles(top);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const selectCarsState = (state: RootState) => state.cars.cars;

    const selectCarsForCarousel = createSelector(
        [selectCarsState],
        (cars) => cars.map(car => ({
            id: car.id,
            title: car.name,
            subtitle: `${ car.brand }, ${ car.model }`,
        }))
    );

    const cars = useSelector(selectCarsForCarousel) as Array<PickerDataType>;
    const carsIsLoading = useSelector<RootState>(state => state.cars.loading);
    const selectedCarID = useSelector<RootState, string>(state => state.cars.selectedCarID);

    const onCarSelect = (id: string) => {
        store.dispatch(selectCar(id));
    }

    const name = `${ session?.user.user_metadata.lastname } ${ session?.user.user_metadata.firstname }`;
    const nameLabel = getLabelByName(name);

    useEffect(() => {
        store.dispatch(loadSelectedCar({}));
    }, []);

    const openProfile = () => {
        router.push("/(profile)/user")
    }

    return (
        <View style={ styles.wrapper }>
            <StatusBar
                barStyle="light-content"
                backgroundColor={ GLOBAL_STYLE.pageContainer.backgroundColor }
            />
            <View style={ styles.barContainer }>
                <View style={{ flex: 1 }}>
                    {
                        !carsIsLoading &&
                        <Picker
                            data={ cars }
                            selectedItemID={ selectedCarID }
                            isDropdown={ true }
                            onDropdownToggle={ setIsDropdownVisible }
                            onSelect={ onCarSelect }
                            placeholder={ "Válasszon autót" }
                        />
                    }
                </View>
                {
                    !isDropdownVisible &&
                    <Avatar.Text
                        label={ nameLabel }
                        avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                        onPress={ openProfile }
                    />
                }
            </View>
        </View>
    )
}

export default MainHeader;