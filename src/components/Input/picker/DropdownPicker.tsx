import React from "react";
import DropdownPickerController, { DropdownPickerControllerProps } from "./DropdownPickerController.tsx";
import DropdownPickerElements from "./DropdownPickerElements.tsx";
import {
    DropdownPickerProvider,
    DropdownPickerProviderProps
} from "../../../contexts/dropdownPicker/DropdownPickerProvider.tsx";
import { PickerItemType } from "./PickerItem.tsx";
import { Paginator } from "../../../types/index.ts";

type StaticDropdownPickerProps = {
    /** This is for static datas, when no pagination needed **/
    data: Array<PickerItemType>
    fetchData?: never
}

type DynamicDropdownPickerProps = {
    /** The fetchData function is for manage pagination in the dropdown picker **/
    fetchData: (paginator: Paginator | Partial<Paginator>) => Promise<Array<PickerItemType>>;
    data?: never;
}
type CommonDropdownPickerProps = {
    /** At first render this item will be selected by default **/
    defaultSelectedValue?: string
    /** Callback function for set the selected value outside of dropdown **/
    setValue?: (value: string) => void
    /** Callback function for checks if dropdown toggle happend **/
    onDropdownToggle?: (show: boolean) => void
    /** If disabled=true means that we cant open the list of elements **/
    disabled?: boolean
    /** If the dropdown picker is disabled then a toast alert appears with this message **/
    disabledText?: string
    /** If alwaysShowItems=true the list of the items always visible, that means toggleDropdown is do nothing**/
    alwaysShowItems?: boolean
    /** If alwaysShowInputController=true the input controller is always visible **/
    alwaysShowInput?: boolean
}

export type DropdownPickerProps =
    (StaticDropdownPickerProps | DynamicDropdownPickerProps)
    & CommonDropdownPickerProps
    & DropdownPickerControllerProps;

const DropdownPicker: React.FC<DropdownPickerProps> = ({
    icon,
    searchBarPlaceholder,
    inputPlaceholder,
    ...restProps
}) => {
    return (
        <DropdownPickerProvider value={ restProps }>
            <DropdownPickerController
                icon={ icon }
                searchBarPlaceholder={ searchBarPlaceholder }
                inputPlaceholder={ inputPlaceholder }
            />
            <DropdownPickerElements/>
        </DropdownPickerProvider>
    );
};

export default DropdownPicker;