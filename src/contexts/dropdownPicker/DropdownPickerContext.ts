import { Context, createContext, useContext } from "react";
import { PickerElement } from "../../components/Input/picker/PickerItem.tsx";

type DropdownPickerContextValue = {
    elements: Array<PickerElement>
    selectedElement?: PickerElement
    onSelect: (value: string) => void
    toggleDropdown: () => void
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    icon?: string
    inputPlaceholder?: string
    searchBarPlaceholder?: string
    disabled: boolean
    horizontal: boolean
    showElements: boolean
    alwaysShowInput: boolean
}

export const DropdownPickerContext = createContext<DropdownPickerContextValue | null>(null);

export const useDropdownPickerContext = () =>
    useContext<DropdownPickerContextValue>(DropdownPickerContext as Context<DropdownPickerContextValue>);