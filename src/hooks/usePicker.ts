import { useCallback, useEffect, useState } from "react";
import { useInputFieldContext } from "../contexts/inputField/InputFieldContext.ts";
import { PickerElement } from "../components/Input/picker/PickerItem.tsx";

export const usePicker = (elements: Array<PickerElement>, setValue?: (value: string) => void) => {
    const [selectedElement, setSelectedElement] = useState<PickerElement | null>(null);
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;

    const findElement = useCallback(
        (id: string) => elements.find(element => element.id === id),
        [elements]
    );

    const onSelect = useCallback((id: string) => {
        const element = findElement(id);
        if(!element) return;

        if(onChange) onChange(element.value);
        if(setValue) setValue(element.value);
        setSelectedElement(element);
    }, [elements, setValue, onChange, findElement]);

    useEffect(() => {
        if(!selectedElement) return;

        const element = findElement(selectedElement.id);
        if(!element) return setSelectedElement(null);

        onSelect(element.id);
    }, [elements, onSelect]);

    return { selectedElement, onSelect };
};