import React, { ProviderProps, useCallback, useEffect, useState } from "react";
import { PickerElement } from "../../components/Input/picker/PickerItem.tsx";
import { DropdownPickerContext } from "./DropdownPickerContext.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { PickerDisabledToast } from "../../ui/alert/presets/toast/index.ts";
import { usePicker } from "../../hooks/usePicker.ts";

export interface DropdownPickerProviderProps {
    elements: Array<PickerElement>;
    defaultSelectedElementId?: string;
    setValue?: (value: string) => void;
    onDropdownToggle?: (show: boolean) => void;
    icon?: string;
    inputPlaceholder?: string;
    searchBarPlaceholder?: string;
    disabled?: boolean;
    disabledText?: string;
    horizontal?: boolean;
    alwaysShowElements?: boolean;
    alwaysShowInput?: boolean;
}

export const DropdownPickerProvider: React.FC<ProviderProps<DropdownPickerProviderProps>> = ({
    children,
    value: {
        elements,
        defaultSelectedElementId,
        setValue,
        onDropdownToggle,
        icon,
        inputPlaceholder = "Válasszon a listából",
        searchBarPlaceholder,
        disabled,
        disabledText,
        horizontal,
        alwaysShowElements,
        alwaysShowInput = true
    }
}) => {
    const { selectedElement, onSelect } = usePicker({ elements, defaultSelectedElementId, setValue });
    const { openToast } = useAlert();

    const [filteredElements, setFilteredElements] = useState(elements);
    const [showElements, setShowElements] = useState<boolean>(!!alwaysShowElements);
    const [searchTerm, setSearchTerm] = useState("");

    const filterElements = useCallback(() => {
        if(searchTerm.length <= 2) return setFilteredElements(elements);

        setFilteredElements(elements.filter(element => element.title?.toLowerCase()
        .includes(searchTerm.toLowerCase())));
    }, [elements, searchTerm]);

    useEffect(() => {
        setFilteredElements(elements);
        filterElements();
    }, [elements]);

    useEffect(() => {
        filterElements();
    }, [searchTerm]);

    useEffect(() => {
        if(onDropdownToggle) onDropdownToggle(showElements);
    }, [showElements]);

    const toggleDropdown = () => {
        if(disabled) return openToast(PickerDisabledToast.warning(disabledText));
        if(!!alwaysShowElements) return;

        setShowElements(prevState => !prevState);
    };

    return (
        <DropdownPickerContext.Provider
            value={ {
                elements: filteredElements,
                selectedElement,
                onSelect,
                toggleDropdown,
                searchTerm,
                setSearchTerm,
                icon,
                inputPlaceholder,
                searchBarPlaceholder,
                disabled,
                horizontal,
                showElements,
                alwaysShowInput
            } }
        >
            { children }
        </DropdownPickerContext.Provider>
    );
};