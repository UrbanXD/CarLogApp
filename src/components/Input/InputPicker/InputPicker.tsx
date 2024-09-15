import React, {useEffect, useState} from "react";
import {any} from "zod";
import {Control, Controller} from "react-hook-form";
import {StyleSheet, Text, View} from "react-native";
import InputTitle from "../InputTitle";
import {SEPARATOR_SIZES} from "../../../constants/constants";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../../constants/theme";
import Picker, { PickerDataType } from "./Picker";
import SearchBar from "../../SearchBar";

export interface InputPickerDataType extends PickerDataType {
    value?: string
}

interface InputPickerProps {
    data: Array<InputPickerDataType>
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    fieldInfoText?: string
    icon?: string
    placeholder?: string
    isInBottomSheet?: boolean
    isHorizontal?: boolean
}
const InputPicker: React.FC<InputPickerProps> = ({
    data,
    control,
    fieldName,
    fieldNameText,
    fieldInfoText,
    icon,
    placeholder,
    isInBottomSheet,
    isHorizontal= true
}) => {
    const [adjustedData, setAdjustedData] = useState<Array<InputPickerDataType>>([] as Array<InputPickerDataType>);
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setAdjustedData(
            data
            .map(item => ({
                ...item,
                value: item.value ?? item.title
            }))
        )
        console.log("xd")
    }, [data]);

    useEffect(() => {
        const filteredData =
            searchTerm.length <= 2
                ?   data
                    .map(item => ({
                        ...item,
                        value: item.value ?? item.title
                    }))
                :   data
                    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item => ({
                        ...item,
                        value: item.value ?? item.title
                    }))

        setAdjustedData(filteredData);
    }, [searchTerm, data]);

    return (
        <View style={ styles.inputContainer }>
            {
                fieldNameText &&
                <InputTitle
                    title={ fieldNameText }
                    subtitle={ fieldInfoText }
                />
            }
            <Controller
                control={ control }
                name={ fieldName }
                render={ ({ field: { onChange } }) =>
                    <Picker
                        data={ adjustedData }
                        setSearchTerm={ (value) => setSearchTerm(value) }
                        selectedItemIndex={ selectedItemIndex }
                        onSelect={ (index: number) => {
                            setSelectedItemIndex(index);
                            onChange(adjustedData[index].value);
                        }}
                        isDropdown={ !isHorizontal }
                        isHorizontal={ isHorizontal }
                        dropDownInfoType={ "input" }
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall,
    },
    formFieldContainer: {
        minHeight: hp(6),
        maxHeight: hp(6),
        flexDirection: "row",
        alignItems: "center",
        gap: hp(1.5),
        backgroundColor: theme.colors.gray4,
        paddingHorizontal: hp(1.5),
        borderRadius: 20,
        overflow: "hidden"
    },
    activeFormFieldContainer: {
        borderWidth: 1,
        borderColor: theme.colors.gray1
    },
    formFieldIconContainer: {
        flex: 0.2,
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        color: theme.colors.gray1,
        // fontFamily: "Gilroy-Medium",
        fontSize: hp(2.25)
    },
    placeholderText: {
        color: theme.colors.gray2
    },
    errorText: {
        paddingLeft: hp(2),
        fontFamily: "Gilroy-Medium",
        fontSize: hp(1.85),
        letterSpacing: hp(1.85) * 0.05,
        color: theme.colors.redLight
    }
})

export default InputPicker;