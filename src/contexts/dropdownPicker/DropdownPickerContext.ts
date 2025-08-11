import { Context, createContext, useContext } from "react";
import { PickerItemType } from "../../components/Input/picker/PickerItem.tsx";

type DropdownPickerContextValue = {
    items: Array<PickerItemType>
    fetchByScrolling: ((direction?: "next" | "prev") => void) | null
    fetchingEnabled: boolean
    selectedItem?: PickerItemType
    onSelect: (value: string) => void
    toggleDropdown: () => void
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    disabled: boolean
    showItems: boolean
    alwaysShowInput: boolean
}

export const DropdownPickerContext = createContext<DropdownPickerContextValue | null>(null);

export const useDropdownPickerContext = () =>
    useContext<DropdownPickerContextValue>(DropdownPickerContext as Context<DropdownPickerContextValue>);