import React from "react";
import DropdownPickerController, { DropdownPickerControllerProps } from "./DropdownPickerController.tsx";
import DropdownPickerElements from "./DropdownPickerElements.tsx";
import {
    DropdownPickerProvider,
    DropdownPickerProviderProps
} from "../../../contexts/dropdownPicker/DropdownPickerProvider.tsx";
import { Paginator } from "../../../database/paginator/AbstractPaginator.ts";
import { DatabaseType } from "../../../database/connector/powersync/AppSchema.ts";
import { ToPickerItemsSelectors } from "../../../utils/toPickerItems.ts";

type StaticDropdownPickerProps<Item> = {
    /** Used when the dropdown has static data and no pagination is required */
    data: Array<Item>
    paginator?: never
}

type DynamicDropdownPickerProps<Item, DB> = {
    /** Used when the dropdown fetches data with pagination */
    paginator: Paginator<Item, DB>
    data?: never
}
type CommonDropdownPickerProps<Item> = {
    /** Defines which fields to use for transforming raw data into picker items */
    dataTransformSelectors: ToPickerItemsSelectors<Item>
    /** The item that will be selected by default on first render */
    defaultSelectedItem?: Item
    /** Callback function for set the selected value outside the dropdown picker **/
    setValue?: (value: string) => void
    /** Callback triggered when the dropdown is toggled */
    onDropdownToggle?: (show: boolean) => void
    /** When true, the dropdown is disabled and cannot be opened */
    disabled?: boolean
    /** Message shown in a toast when trying to open a disabled dropdown */
    disabledText?: string
    /** When true, the item list is always visible and cannot be toggled */
    alwaysShowItems?: boolean
    /** When true, the input controller is always visible */
    alwaysShowInput?: boolean
}

export type DropdownPickerProps<Item, DB> =
    (StaticDropdownPickerProps<Item> | DynamicDropdownPickerProps<Item, DB>)
    & CommonDropdownPickerProps<Item>
    & DropdownPickerControllerProps;

const DropdownPicker = <Item, DB = DatabaseType, >({
    icon,
    searchBarPlaceholder,
    inputPlaceholder,
    ...restProps
}: DropdownPickerProps<Item, DB>) => {
    return (
        <DropdownPickerProvider<Item, DB> { ...restProps }>
            <DropdownPickerController
                icon={ icon }
                searchBarPlaceholder={ searchBarPlaceholder }
                inputPlaceholder={ inputPlaceholder }
            />
            <DropdownPickerElements searchBarPlaceholder={ searchBarPlaceholder }/>
        </DropdownPickerProvider>
    );
};

export default DropdownPicker;