import React, {ReactNode, useCallback, useEffect, useRef, useState} from "react";
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
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SearchBar from "../../SearchBar";
import InputText from "../InputText/InputText";
import TextInput from "../InputText/TextInput";
import {err} from "react-native-svg";

export interface PickerDataType {
    id?: string
    title: string
    subtitle?: string
}

type PickerProps = {
    data: Array<PickerDataType>
    selectedItemID: string
    onSelect: (id: string) => void
    isHorizontal?: boolean
    searchTerm?: string
    setSearchTerm?: (value: string) => void
    isDropdown?: boolean
    onDropdownToggle?: (isVisible: boolean) => void
    dropDownInfoType?: "simple" | "input"
    placeholder?: string
    error?: string
}

const Picker: React.FC<PickerProps> = ({
    data,
    isDropdown = false,
    onDropdownToggle,
    dropDownInfoType= "simple",
    placeholder = "Válasszon",
    error,
    searchTerm = "",
    setSearchTerm,
    onSelect,
    selectedItemID,
    isHorizontal= true
}) => {
    const flatlistRef = useRef<FlatList>(null)
    const [isDropdownContentVisible, setIsDropdownContentVisible] = useState(!isDropdown);

    const memoizedSetSelected = useCallback(
        (id: string) => {
            onSelect(id);
            setIsDropdownContentVisible(false);
        },
        [data, setIsDropdownContentVisible]
    );

    useEffect(() => {
        if(onDropdownToggle) onDropdownToggle(isDropdownContentVisible);

        if(isDropdownContentVisible && data.length >= 1) {
            const selectedItemIndex = data.map(item => item.id).indexOf(selectedItemID);
            if(selectedItemIndex !== -1) {
                flatlistRef?.current?.scrollToIndex({
                    index: selectedItemIndex,
                    animated: true
                })
            }
        }

    }, [isDropdownContentVisible]);

    useEffect(() => {
        if(isDropdownContentVisible && data.length >= 1) {
            const selectedItemIndex = data.map(item => item.id).indexOf(selectedItemID);
            if(selectedItemIndex !== -1) {
                flatlistRef?.current?.scrollToIndex({
                    index: selectedItemIndex,
                    animated: true
                })
            } else {
                flatlistRef?.current?.scrollToIndex({
                    index: 0,
                    animated: false
                })
            }
        }
    }, [data]);

    const renderElements = () =>
        <View style={[styles.elementsContainer, !isHorizontal && { height: styles.inputPickerItemContainer.height * 5 + 5 * SEPARATOR_SIZES.small, flexDirection: "column" }]}>
            {
                !setSearchTerm && isDropdown &&
                <IconButton
                    icon={ ICON_NAMES.close }
                    size={ FONT_SIZES.normal }
                    iconColor={ theme.colors.white }
                    onPress={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                    style={ [GET_ICON_BUTTON_RESET_STYLE(FONT_SIZES.normal), { alignSelf: "center" }] }
                />
            }
            {
                setSearchTerm &&
                <SearchBar
                    term={ searchTerm }
                    onTextChange={ (value) => setSearchTerm(value) }
                    onClose={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                />
            }
            <FlatList
                ref={ flatlistRef }
                data={ data }
                renderItem={
                    ({ item, index }) =>
                        <View key={ index } style={{ flexDirection: "row" }}>
                            <PickerItem
                                title={ item.title }
                                subtitle={ item.subtitle }
                                selected={ item.id === selectedItemID }
                                onPress={ () => memoizedSetSelected(item.id || index.toString() ) }
                            />
                            {
                                isHorizontal && index === (data.length - 1) &&
                                <View style={ styles.separator } />
                            }
                        </View>
                }
                keyExtractor={(item, index) => item.id || index.toString()}
                horizontal={ isHorizontal }
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={ styles.elementsScrollViewContainer }
                onScrollToIndexFailed={
                    (info) => {
                        setTimeout(() => {
                            flatlistRef.current?.scrollToIndex({ index: info.index, animated: true });
                        }, 100);
                    }
                }
            />
        </View>
    return (
        <View style={ styles.container }>
            {
                isDropdown
                ?   isDropdownContentVisible
                    ?   renderElements()
                    :   dropDownInfoType === "simple"
                        ?   <PickerSimpleDropdownInfo
                                toggleDropdown={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                                icon={ ICON_NAMES.car }
                                title={ data.find(item => item.id === selectedItemID)?.title }
                                subtitle={ data.find(item => item.id === selectedItemID)?.subtitle }
                                placeholder={ placeholder }
                                error={ error }
                                isHorizontal={ isHorizontal }
                            />
                        :   <PickerInputDropdownInfo
                                toggleDropdown={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                                icon={ ICON_NAMES.car }
                                title={ data.find(item => item.id === selectedItemID)?.title }
                                error={ error }
                                placeholder={ placeholder }
                                isHorizontal={ isHorizontal }
                            />
                :   renderElements()
            }
        </View>
    )
}

interface PickerDropdownInfoProps {
    toggleDropdown?: () => void
    icon?: string
    title?: string
    placeholder?: string
    error?: string
    isHorizontal: boolean
}

interface PickerSimpleDropdownInfoProps extends PickerDropdownInfoProps{
    subtitle?: string
}

const PickerInputDropdownInfo: React.FC<PickerDropdownInfoProps> = ({
    toggleDropdown,
    icon,
    title,
    placeholder,
    error,
    isHorizontal
}) => {
    return (
        <TouchableOpacity
    style={{ alignItems: "center", flexDirection: "row", gap: SEPARATOR_SIZES.lightSmall }}
    onPress={ toggleDropdown }
        >
            <View style={ GLOBAL_STYLE.formContainer }>
                <TextInput
                    value={ title }
                    isEditable={ false }
                    icon={ icon }
                    actionIcon={ isHorizontal ? ICON_NAMES.rightArrowHead : ICON_NAMES.downArrowHead }
                    placeholder={ placeholder }
                    error={ error }
                    isPickerHeader
                />
            </View>
        </TouchableOpacity>
    )
}

const PickerSimpleDropdownInfo: React.FC<PickerSimpleDropdownInfoProps> = ({
    toggleDropdown,
    icon,
    title,
    subtitle,
    placeholder,
    isHorizontal
}) => {
    return (
        <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: SEPARATOR_SIZES.lightSmall }}
            onPress={ toggleDropdown }
        >
            {
                icon &&
                <Icon source={ icon } size={ styles.inputPickerTitleText.fontSize * 2 } color={ theme.colors.white } />
            }
            <View>
                <Text style={ styles.inputPickerTitleText } numberOfLines={ 1 } >
                    { title ? title : placeholder }
                </Text>
                {
                    subtitle &&
                    <Text style={ styles.inputPickerSubtitleText } numberOfLines={ 1 } >
                        { subtitle }
                    </Text>
                }
            </View>
            <IconButton
                icon={ isHorizontal ? ICON_NAMES.rightArrowHead : ICON_NAMES.downArrowHead }
                size={ styles.inputPickerTitleText.fontSize * 2 }
                iconColor={ theme.colors.white }
                style={ [GET_ICON_BUTTON_RESET_STYLE(styles.inputPickerTitleText.fontSize * 2), { marginLeft: -styles.inputPickerTitleText.fontSize + SEPARATOR_SIZES.lightSmall }] }
            />
        </TouchableOpacity>
    )
}

interface PickerItemProps {
    onPress: () => void
    title: string
    subtitle?: string
    error?: string
    selected: boolean
}

const PickerItem: React.FC<PickerItemProps> = ({
    onPress,
    title,
    subtitle,
    error,
    selected
}) => {
    return (
        <TouchableOpacity onPress={ onPress } style={ [styles.inputPickerItemContainer, selected && styles.inputPickerSelectedItemContainer] }>
            <Text numberOfLines={ 1 } style={ styles.inputPickerTitleText }>
                { title }
            </Text>
            {
                subtitle &&
                    <Text numberOfLines={ 1 } style={ styles.inputPickerSubtitleText }>
                        { subtitle }
                    </Text>
            }
        </TouchableOpacity>
    )
}

const styles= StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    elementsContainer: {
        flex: 1,
        flexDirection: "row",
        // alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        overflow: "hidden"
    },
    elementsScrollViewContainer: {
        ...GLOBAL_STYLE.scrollViewContentContainer,
        gap: SEPARATOR_SIZES.small
    },
    separator: {
        flex: 1,
        width: DEFAULT_SEPARATOR
    },
    inputPickerItemContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.gray3,
        height: hp(6),
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

export default Picker;