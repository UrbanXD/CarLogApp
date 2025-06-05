import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageSourcePropType } from "react-native";
import {
    ICON_NAMES,
} from "../../../../../constants/constants";
import { InputPickerDropdownInfo, PickerDropdownInfo } from "./PickerDropdownInfo";
import PickerElements from "./PickerElements";

export interface PickerDataType {
    id?: string
    title: string
    subtitle?: string
    icon?: ImageSourcePropType
}

interface PickerProps {
    data: Array<PickerDataType>
    selectedItemID?: string
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
    disabledText?: string
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
        selectedItemID,
        onDropdownToggle,
        isDropdown,
        dropDownInfoType,
        placeholder,
        error,
        isHorizontal,
        disabled,
        disabledText
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
                                title={ props.data.find((item) => item.id === selectedItemID)?.title }
                                subtitle={ props.data.find((item) => item.id === selectedItemID)?.subtitle }
                                placeholder={ placeholder }
                                error={ error }
                                isHorizontal={ isHorizontal }
                                disabled={ disabled }
                                disabledText={ disabledText }
                            />
                        :   <InputPickerDropdownInfo
                                toggleDropdown={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                                icon={ ICON_NAMES.car }
                                title={ props.data.find((item) => item.id === selectedItemID)?.title }
                                error={ error }
                                placeholder={ placeholder }
                                isHorizontal={ isHorizontal }
                                disabled={ disabled }
                                disabledText={ disabledText }
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