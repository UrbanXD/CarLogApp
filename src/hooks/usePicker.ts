import { useState } from "react";
import { useInputFieldContext } from "../contexts/inputField/InputFieldContext.ts";
import { PickerElement } from "../components/Input/picker/PickerItem.tsx";

export const usePicker = (elements: Array<PickerElement>, setValue?: (value: string) => void) => {
    const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;

    const findElement = (id: string) => elements.find(element => element.id === id);

    const onSelect = (id: string) => {
        const element = findElement(id);
        if(!element) return;

        if(onChange) onChange(element.value);
        if(setValue) setValue(element.value);
        setSelectedElementId(id);
    };

    return {
        selectedElement: findElement(selectedElementId),
        onSelect
    };
};