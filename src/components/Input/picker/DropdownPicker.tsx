import React from "react";
import DropdownPickerController, { DropdownPickerControllerProps } from "./DropdownPickerController.tsx";
import DropdownPickerItems from "./DropdownPickerItems.tsx";
import {
    DropdownPickerProvider,
    DropdownPickerProviderProps
} from "../../../contexts/dropdownPicker/DropdownPickerProvider.tsx";
import { Paginator } from "../../../database/paginator/AbstractPaginator.ts";
import { DatabaseType } from "../../../database/connector/powersync/AppSchema.ts";
import { ToPickerItemsSelectors } from "../../../utils/toPickerItems.ts";

type ConditionalDropdownPickerProps<Item, DB> = | {
    /** Used when the dropdown fetches data with pagination */
    paginator: Paginator<Item, DB>
    searchBy?: keyof Item
    /** Used when the dropdown has static data and no pagination is required */
    data?: never
} | {
    paginator?: never
    searchBy?: never
    data: Array<Item>
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
    /** When true, the search bar will be displayed above the list */
    searchBarEnable?: boolean
    /** Placeholder text shown inside the search bar input */
    searchBarPlaceholder?: string
    /** When true, items are rendered in a masonry-style layout */
    masonry?: boolean
    /** Number of columns to display when using masonry layout */
    numColumns?: number
} & DropdownPickerControllerProps;

export type DropdownPickerProps<Item, DB> =
    ConditionalDropdownPickerProps<Item, DB> & CommonDropdownPickerProps<Item>;

const DropdownPicker = <Item, DB = DatabaseType, >({
    icon,
    searchBarPlaceholder,
    inputPlaceholder,
    masonry,
    numColumns,
    ...restProps
}: DropdownPickerProps<Item, DB>) => {
    return (
        <DropdownPickerProvider<Item, DB> { ...restProps }>
            <DropdownPickerController
                icon={ icon }
                searchBarPlaceholder={ searchBarPlaceholder }
                inputPlaceholder={ inputPlaceholder }
            />
            <DropdownPickerItems
                masonry={ masonry }
                numColumns={ numColumns }
                searchBarPlaceholder={ searchBarPlaceholder }
            />
        </DropdownPickerProvider>
    );
};

export default DropdownPicker;