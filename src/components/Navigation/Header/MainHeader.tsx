import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { GLOBAL_STYLE, SIMPLE_HEADER_HEIGHT } from "../../../constants/index.ts";
import Picker, {PickerDataType} from "../../Input/picker/Picker.tsx";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "../../Avatar/Avatar.ts";
import useHeaderStyles from "../../../hooks/useHeaderStyles.tsx";
import { router } from "expo-router";
import { getLabelByName } from "../../../utils/getLabelByName.ts";
import { useAuth } from "../../../contexts/Auth/AuthContext.ts";
import { RootState } from "../../../database/redux/index.ts";
import { loadSelectedCar } from "../../../features/car/model/actions/loadSelectedCar.ts";
import { selectCar } from "../../../features/car/model/actions/selectCar.ts";
import { store } from "../../../database/redux/store.ts";
import {getCarsAsCarouselElements, isLoading} from "../../../features/car/model/selectors/index.ts";
import {useAppSelector} from "../../../hooks/index.ts";
import {getSelectedCarId} from "../../../features/car/model/selectors/getSelectedCarId.ts";

const MainHeader: React.FC = () => {
    const { user, userLoading} = useAuth();
    const { top } = useSafeAreaInsets();
    const styles = useHeaderStyles(top);

    const name = `${ user?.lastname } ${ user?.firstname }`;
    const avatarColor = user?.avatarColor;

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const cars = useAppSelector(getCarsAsCarouselElements());
    const carsLoading = useAppSelector(isLoading);
    const selectedCarId = useAppSelector(getSelectedCarId);

    const onCarSelect = (id: string) => {
        store.dispatch(selectCar(id));
    }

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
                        !carsLoading &&
                        <Picker
                            data={ cars }
                            selectedItemId={ selectedCarId }
                            isDropdown={ true }
                            onDropdownToggle={ setIsDropdownVisible }
                            onSelect={ onCarSelect }
                            placeholder={ "Válasszon autót" }
                        />
                    }
                </View>
                {
                    !isDropdownVisible && (
                        userLoading
                            ?   <Avatar.Skeleton
                                    avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                />
                            :   user?.userAvatar
                                    ?   <Avatar.Image
                                            source={ user.userAvatar.image }
                                            avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                            onPress={ openProfile }
                                        />
                                    :   <Avatar.Text
                                            label={ getLabelByName(name) }
                                            avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                            backgroundColor={ avatarColor ?? undefined }
                                            onPress={ openProfile }
                                        />
                    )
                }
            </View>
        </View>
    )
}

export default MainHeader;