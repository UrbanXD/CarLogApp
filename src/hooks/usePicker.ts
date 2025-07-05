import { useCallback, useEffect, useState } from "react";
import { useInputFieldContext } from "../contexts/inputField/InputFieldContext.ts";
import { PickerElement } from "../components/Input/picker/PickerItem.tsx";

type UsePickerArgs = {
    elements: Array<PickerElement>
    defaultValue?: string
    setValue: (value: string) => void
}

export const usePicker = ({ elements, defaultValue, setValue }: UsePickerArgs) => {
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;

    const findElement = useCallback(
        (value: string) => elements.find(element => element.value === value),
        [elements]
    );

    const [selectedElement, setSelectedElement] = useState<PickerElement | undefined>(
        findElement(inputFieldContext?.field.value ?? defaultValue)
    );

    const onSelect = useCallback((value: string) => {
        const element = findElement(value);
        if(!element) return;

        if(onChange) onChange(element.value);
        if(setValue) setValue(element.value);
        setSelectedElement(element);
    }, [elements, setValue, onChange, findElement]);

    useEffect(() => {
        if(!selectedElement) return;
        const element = findElement(selectedElement.value);

        if(onChange) onChange(element?.value ?? "");
        if(setValue) setValue(element?.value ?? "");

        setSelectedElement(element);
    }, [elements]);

    return { selectedElement, onSelect };
};