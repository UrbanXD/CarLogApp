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

type StaticDropdownPickerProps<Data> = {
    /** Used when the dropdown has static data and no pagination is required */
    data: Array<Data>
    paginator?: never
}

type DynamicDropdownPickerProps<Data, DB> = {
    /** Used when the dropdown fetches data with pagination */
    paginator: Paginator<Data, DB>
    data?: never
}
type CommonDropdownPickerProps<Data> = {
    /** Defines which fields to use for transforming raw data into picker items */
    dataTransformSelectors: ToPickerItemsSelectors<Data>
    /** The value that will be selected by default on first render */
    defaultSelectedValue?: string
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

export type DropdownPickerProps<Data, DB> =
    (StaticDropdownPickerProps<Data> | DynamicDropdownPickerProps<Data, DB>)
    & CommonDropdownPickerProps<Data>
    & DropdownPickerControllerProps;

const DropdownPicker = <Data, DB = DatabaseType, >({
    icon,
    searchBarPlaceholder,
    inputPlaceholder,
    ...restProps
}: DropdownPickerProps<Data, DB>) => {
    return (
        <DropdownPickerProvider<Data, DB> { ...restProps }>
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