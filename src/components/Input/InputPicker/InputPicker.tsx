import React, {useCallback, useEffect} from "react";
import { SharedValue } from "react-native-reanimated";
import InputPickerItem from "./InputPickerItem";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import Carousel from "../../Carousel/Carousel";
import {Picker} from "@react-native-picker/picker";

interface InputPickerProps {
    data: Array<string>
    horizontal?: boolean
    itemSizePercentage?: number
    control: Control<any>
    fieldName: string
    setValue: UseFormSetValue<any>
}

const InputPicker: React.FC<InputPickerProps> = ({ data, horizontal, itemSizePercentage, control, fieldName, setValue }) => {

    const memoizedSetSelected = useCallback(
        (value: string) => {
            setValue(fieldName, value);
        },
        [setValue, fieldName]
    );

    const memoizedRenderItem = useCallback(
        (item: string, index: number, size: number, coordinate: SharedValue<number>) => (
            <InputPickerItem
                title={item}
                index={index}
                size={size}
                coordinate={coordinate}
            />
        ),
        []
    );


    return (
        <Controller
            control={ control }
            name={ fieldName || "xd" }
            render={
                () =>
                    <Carousel
                        data={ data }
                        itemSizePercentage={ itemSizePercentage }
                        renderItem={ memoizedRenderItem }
                    />
            }
        />
    )
}

export default InputPicker;