import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import InputTitle from "../InputTitle";
import { ControllerRenderArgs, SEPARATOR_SIZES } from "../../../constants/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../../constants/theme";
import Picker, { PickerDataType } from "./Picker";

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
    isCarousel?: boolean
    withSearchbar?: boolean
    disabled?: boolean
    disabledText?: string
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
    isHorizontal = false,
    isCarousel = true,
    withSearchbar = false,
    disabled = false,
    disabledText
}) => {
    const [allData, setAllData] = useState<Array<PickerDataType>>([] as Array<PickerDataType>);
    const [adjustedData, setAdjustedData] = useState<Array<InputPickerDataType>>([] as Array<InputPickerDataType>);
    const [selectedItemID, setSelectedItemID] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDataAdjusted, setIsDataAdjusted] = useState(false);
    const [previousShortTerm, setPreviousShortTerm] = useState(false);

    useEffect(() => {
        setIsDataAdjusted(true);
    }, [adjustedData]);

    useEffect(() => {
        const updatedData = data.map((item, index) => ({
            ...item,
            id: item.id ?? index.toString(),
            value: item.value ?? item.title
        }));

        setAllData(updatedData);
    }, [data]);

    useEffect(() => {
        if(allData.length <= 0) return;

        if (searchTerm.length <= 2) {
            if (!previousShortTerm) {
                setAdjustedData(allData);
                setPreviousShortTerm(true);
            }
        } else {
            const filteredData = allData.filter(
                item => item
                        .title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            setAdjustedData(filteredData);

            if(previousShortTerm) setPreviousShortTerm(false);
        }
    }, [searchTerm, allData]);


    const render = (args: ControllerRenderArgs) => {
        const { field: { onChange }, fieldState: { error } } = args;

        return (
            isDataAdjusted
                ?   <Picker
                        data={ adjustedData }
                        error = { error?.message }
                        searchTerm={ searchTerm }
                        setSearchTerm={ withSearchbar ? ((value) => setSearchTerm(value)) : undefined }
                        selectedItemID={ selectedItemID }
                        onSelect={
                            (id: string) => {
                                setSelectedItemID(id);
                                onChange(adjustedData.find(item => item.id === id)?.value?.toString());
                            }
                        }
                        isDropdown={ !isHorizontal }
                        isHorizontal={ isHorizontal }
                        isCarousel={ isCarousel }
                        dropDownInfoType="input"
                        disabled={ disabled }
                        disabledText={ disabledText }
                    />
                :   <></>
        )
    }

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
                render={ render }
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