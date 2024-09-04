import React, {useCallback, useEffect, useRef, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Icon, IconButton} from "react-native-paper";
import {
    DEFAULT_SEPARATOR, FONT_SIZES,
    GET_ICON_BUTTON_RESET_STYLE,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../../constants/constants";
import {theme} from "../../../constants/theme";
import {FlatList} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";
import {RootState, store} from "../../../redux/store";
import {loadSelectedCar, selectCar} from "../../../redux/reducers/cars.slices";

export interface InputPickerDataType {
    id: number
    title: string
    subtitle: string
}

interface InputPickerProps {
    data: Array<InputPickerDataType>
    onDropdownToggle?: (isVisible: boolean) => void;
}

const InputPicker: React.FC<InputPickerProps> = ({ data, onDropdownToggle }) => {
    const flatlistRef = useRef<FlatList>(null)

    const selectedIndex = useSelector<RootState, number>(state => state.cars.selectedCarIndex);
    const [isDropdownContentVisible, setIsDropdownContentVisible] = useState(false);

    const memoizedSetSelected = useCallback(
        (index: number) => {
            store.dispatch(selectCar(index));
            setIsDropdownContentVisible(!isDropdownContentVisible);

        },
        [data, setIsDropdownContentVisible]
    );

    useEffect(() => {
        store.dispatch(loadSelectedCar({}));
    }, []);

    useEffect(() => {
        if(onDropdownToggle) onDropdownToggle(isDropdownContentVisible);

        if(isDropdownContentVisible)
            flatlistRef?.current?.scrollToIndex({
                index: selectedIndex,
                animated: true,
            })

    }, [isDropdownContentVisible]);

    return (
        <View style={ styles.container }>
            <View>
                {
                    isDropdownContentVisible
                    ?   <View style={{ flexDirection: "row", alignItems: "center", gap: SEPARATOR_SIZES.lightSmall }}>
                            <IconButton
                                icon={ ICON_NAMES.close }
                                size={ FONT_SIZES.normal }
                                iconColor={ theme.colors.white }
                                onPress={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                                style={ GET_ICON_BUTTON_RESET_STYLE(FONT_SIZES.normal) }
                            />
                            <FlatList
                                ref={ flatlistRef }
                                data={ data }
                                renderItem={
                                    ({ item, index }) =>
                                        <View key={ index } style={{ flexDirection: "row" }}>
                                            { index === 0 && <View style={{ flex: 1, width: DEFAULT_SEPARATOR }} />}
                                            <InputPickerItem
                                                title={ item.title }
                                                subtitle={ item.subtitle }
                                                selected={ index === selectedIndex }
                                                onPress={ () => memoizedSetSelected(index) }
                                            />
                                            { index === (data.length - 1) && <View style={{ flex: 1, width: DEFAULT_SEPARATOR }} />}
                                        </View>
                                }
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={ false }
                                contentContainerStyle={ [GLOBAL_STYLE.scrollViewContentContainer, {gap: 10}]}
                                onScrollToIndexFailed={(info) => {
                                    setTimeout(() => {
                                        flatlistRef.current?.scrollToIndex({ index: info.index, animated: true });
                                    }, 100);
                                }}
                            />
                        </View>
                    :   <TouchableOpacity style={{ alignItems: "center", flexDirection: "row", gap: SEPARATOR_SIZES.lightSmall }} onPress={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }>
                            <Icon source={ ICON_NAMES.car } size={ styles.inputPickerTitleText.fontSize * 2 } color={ theme.colors.white } />
                            <View style={{  }}>
                                <Text style={ styles.inputPickerTitleText } numberOfLines={ 1 } >
                                    { data[selectedIndex].title }
                                </Text>
                                <Text style={ styles.inputPickerSubtitleText } numberOfLines={ 1 } >
                                    { data[selectedIndex].subtitle }
                                </Text>
                            </View>
                            <IconButton
                                icon={ ICON_NAMES.rightArrowHead }
                                size={ styles.inputPickerTitleText.fontSize * 2 }
                                iconColor={ theme.colors.white }
                                style={ [GET_ICON_BUTTON_RESET_STYLE(styles.inputPickerTitleText.fontSize * 2), { marginLeft: -styles.inputPickerTitleText.fontSize + SEPARATOR_SIZES.lightSmall }] }
                            />
                        </TouchableOpacity>
                }
            </View>
        </View>
        // <Controller
        //     control={ control }
        //     name={ fieldName || "xd" }
        //     render={
        //         () =>
        //             <Carousel
        //                 data={ data }
        //                 itemSizePercentage={ itemSizePercentage }
        //                 renderItem={ memoizedRenderItem }
        //             />
        //     }
        // />
    )
}

interface InputPickerItemProps {
    onPress: () => void
    title: string
    subtitle?: string
    selected: boolean
}

const InputPickerItem: React.FC<InputPickerItemProps> = ({ onPress, title, subtitle, selected }) => {
    return (
        <TouchableOpacity onPress={ onPress } style={ [styles.inputPickerItemContainer, selected && styles.inputPickerSelectedItemContainer] }>
            <Text numberOfLines={ 1 } style={ styles.inputPickerTitleText }>
                { title }
            </Text>
            <Text numberOfLines={ 1 } style={ styles.inputPickerSubtitleText }>
                { subtitle }
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center"
        // marginHorizontal: DEFAULT_SEPARATOR * -1
    },
    inputPickerItemContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.gray3,
        // width: wp(35),
        borderRadius: 15,
        paddingHorizontal: SEPARATOR_SIZES.normal
    },
    inputPickerSelectedItemContainer: {
        borderWidth: 1.5,
        borderColor: theme.colors.gray1
    },
    inputPickerTitleText: {
        ...GLOBAL_STYLE.containerTitleText,
        fontSize: GLOBAL_STYLE.containerTitleText.fontSize * 0.7,
        letterSpacing: GLOBAL_STYLE.containerTitleText.letterSpacing * 0.7
    },
    inputPickerSubtitleText: {
        ...GLOBAL_STYLE.containerText,
        fontSize: GLOBAL_STYLE.containerText.fontSize * 0.8,
        letterSpacing: GLOBAL_STYLE.containerText.letterSpacing * 0.8
    }
})

export default InputPicker;