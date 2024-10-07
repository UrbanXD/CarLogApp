import React, {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { Icon, IconButton } from "react-native-paper";
import {
    DEFAULT_SEPARATOR, FONT_SIZES,
    GET_ICON_BUTTON_RESET_STYLE,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../../constants/constants";
import { theme } from "../../../constants/theme";
import { FlatList } from "react-native-gesture-handler";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SearchBar from "../../shared/SearchBar";
import TextInput from "../InputText/TextInput";
import PickerItem from "./PickerItem";
import {InputPickerDropdownInfo, PickerDropdownInfo} from "./PickerDropdownInfo";
import InputPicker from "./InputPicker";
import {Callback} from "@react-native-async-storage/async-storage/lib/typescript/types";

export interface PickerDataType {
    id?: string
    title: string
    subtitle?: string
    icon?: ImageSourcePropType
}

interface PickerProps {
    data: Array<PickerDataType>
    selectedItemID: string
    onSelect: (id: string) => void
    isHorizontal?: boolean
    isCarousel?: boolean
    searchTerm?: string
    setSearchTerm?: (value: string) => void
    isDropdown?: boolean
    onDropdownToggle?: (isVisible: boolean) => void
    dropDownInfoType?: "simple" | "input"
    placeholder?: string
    error?: string
    disabled?: boolean
}

const Picker: React.FC<PickerProps> = (initialProps) => {
    const props = {
        isDropdown: false,
        dropDownInfoType: "simple",
        placeholder: "Válasszon",
        searchTerm: "",
        isHorizontal: true,
        isCarousel: true,
        disabled: false,
        ...initialProps,
    };

    const {
        data,
        onDropdownToggle,
        isDropdown,
        dropDownInfoType,
        placeholder,
        error,
        selectedItemID,
        isHorizontal,
        disabled,
    } = props;

    const [isDropdownContentVisible, setIsDropdownContentVisible] = useState(!isDropdown);

    useEffect(() => {
        if(onDropdownToggle) onDropdownToggle(isDropdownContentVisible);
    }, [isDropdownContentVisible]);

    return (
        <View style={ styles.container }>
            {
                isDropdown
                ?   isDropdownContentVisible
                    ?   <PickerElements
                            { ...props }
                            isDropdownContentVisible={ isDropdownContentVisible }
                            setIsDropdownContentVisible={ setIsDropdownContentVisible }
                        />
                    :   dropDownInfoType === "simple"
                        ?   <PickerDropdownInfo
                                toggleDropdown={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                                icon={ ICON_NAMES.car }
                                title={ data.find(item => item.id === selectedItemID)?.title }
                                subtitle={ data.find(item => item.id === selectedItemID)?.subtitle }
                                placeholder={ placeholder }
                                error={ error }
                                isHorizontal={ isHorizontal }
                                disabled={ disabled }
                            />
                        :   <InputPickerDropdownInfo
                                toggleDropdown={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                                icon={ ICON_NAMES.car }
                                title={ data.find(item => item.id === selectedItemID)?.title }
                                error={ error }
                                placeholder={ placeholder }
                                isHorizontal={ isHorizontal }
                                disabled={ disabled }
                            />
                :   <PickerElements
                        { ...props }
                        isDropdownContentVisible={ isDropdownContentVisible }
                        setIsDropdownContentVisible={ setIsDropdownContentVisible }
                    />
            }
        </View>
    )
}

interface PickerElementsProps {
    data: Array<PickerDataType>
    selectedItemID: string
    onSelect: (id: string) => void
    isHorizontal?: boolean
    isCarousel?: boolean
    searchTerm?: string
    setSearchTerm?: (value: string) => void
    isDropdown?: boolean
    isDropdownContentVisible: boolean
    setIsDropdownContentVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const PickerElements: React.FC<PickerElementsProps> = ({
    data,
    onSelect,
    selectedItemID,
    searchTerm,
    setSearchTerm,
    isDropdown,
    isHorizontal,
    isCarousel,
    isDropdownContentVisible,
    setIsDropdownContentVisible
}) => {
    const flatListRef = useRef<FlatList>(null)

    const select = (id: string) => {
        onSelect(id);
        setIsDropdownContentVisible(false);
    }

    const renderItem = (arg: { item: any, index: number }) =>
        <React.Fragment key={ arg.index }>
            <PickerItem
                title={ arg.item.title }
                subtitle={ arg.item.subtitle }
                icon={ arg.item.icon }
                selected={ arg.item.id === selectedItemID }
                onPress={ () => select(arg.item.id || arg.index.toString() ) }
            />
            {
                isHorizontal && isCarousel && arg.index === (data.length - 1) &&
                <View style={ styles.separator } />
            }
        </React.Fragment>

    useEffect(() => {
        if(isDropdownContentVisible && data.length >= 1) {
            const selectedItemIndex = data.map(item => item.id).indexOf(selectedItemID);
            if(selectedItemIndex !== -1) {
                flatListRef?.current?.scrollToIndex({
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
                // flatlistRef?.current?.scrollToIndex({
                //     index: selectedItemIndex,
                //     animated: true
                // })
            } else {
                flatListRef?.current?.scrollToIndex({
                    index: 0,
                    animated: false
                })
            }
        }
    }, [data]);

    return (
        <View style={[styles.elementsContainer, !isHorizontal && { height: 30 * 5 + 5 * SEPARATOR_SIZES.small, flexDirection: "column" }]}>
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
            {
                isCarousel
                    ?   <FlatList
                        ref={ flatListRef }
                        data={ data }
                        renderItem={ renderItem }
                        keyExtractor={(item, index) => item.id || index.toString()}
                        horizontal={ isHorizontal }
                        showsHorizontalScrollIndicator={ false }
                        contentContainerStyle={ styles.elementsScrollViewContainer }
                        onScrollToIndexFailed={
                            (info) => {
                                setTimeout(() => {
                                    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                                }, 100);
                            }
                        }
                    />
                    :   <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SEPARATOR_SIZES.small }}>
                            {
                                data.length >= 1
                                ?   data.map((item, index) => {
                                        return renderItem({ item, index });
                                    })
                                :   <Text style={{color: "white"}}>Nincs elem</Text>
                            }
                        </View>
            }
        </View>
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
    }
})

export default Picker;