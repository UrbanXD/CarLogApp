import { Context, createContext, useContext } from "react";
import { PickerItemType } from "../../components/Input/picker/PickerItem.tsx";

type DropdownPickerContextValue = {
    items: Array<PickerItemType>
    fetchByScrolling: () => void | null
    selectedItem?: PickerItemType
    onSelect: (value: string) => void
    toggleDropdown: () => void
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    itemsFiltered: boolean
    setItemsFiltered: (itemsFiltered: boolean) => void
    disabled: boolean
    showItems: boolean
    alwaysShowInput: boolean
}

export const DropdownPickerContext = createContext<DropdownPickerContextValue | null>(null);

export const useDropdownPickerContext = () =>
    useContext<DropdownPickerContextValue>(DropdownPickerContext as Context<DropdownPickerContextValue>);