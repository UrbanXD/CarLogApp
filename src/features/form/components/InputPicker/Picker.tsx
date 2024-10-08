import React, {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { Icon, IconButton } from "react-native-paper";
import {
    DEFAULT_SEPARATOR, FONT_SIZES,
    GET_ICON_BUTTON_RESET_STYLE,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../../core/constants/constants";
import { theme } from "../../../core/constants/theme";
import { FlatList } from "react-native-gesture-handler";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SearchBar from "../../../core/components/shared/SearchBar";
import TextInput from "../InputText/TextInput";
import PickerItem from "./PickerItem";
import {InputPickerDropdownInfo, PickerDropdownInfo} from "./PickerDropdownInfo";
import InputPicker from "./InputPicker";
import {Callback} from "@react-native-async-storage/async-storage/lib/typescript/types";
import PickerElements from "./PickerElements";

export interface PickerDataType {
    id?: string
    title: string
    subtitle?: string
    icon?: ImageSourcePropType
}

interface PickerProps {
    data: Array<PickerDataType>
    selectedItem: PickerDataType
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
        selectedItem,
        onDropdownToggle,
        isDropdown,
        dropDownInfoType,
        placeholder,
        error,
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
                                title={ selectedItem?.title }
                                subtitle={ selectedItem?.subtitle }
                                placeholder={ placeholder }
                                error={ error }
                                isHorizontal={ isHorizontal }
                                disabled={ disabled }
                            />
                        :   <InputPickerDropdownInfo
                                toggleDropdown={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                                icon={ ICON_NAMES.car }
                                title={ selectedItem?.title }
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

const styles= StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    }
})

export default Picker;