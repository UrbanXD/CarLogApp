import React, { useCallback, useEffect, useMemo, useState } from "react";
import DropdownPickerController, { DropdownPickerControllerProps } from "./dropdown/DropdownPickerController.tsx";
import DropdownPickerItems from "./dropdown/DropdownPickerItems.tsx";
import { Paginator } from "../../../database/paginator/AbstractPaginator.ts";
import { DatabaseType } from "../../../database/connector/powersync/AppSchema.ts";
import { PopupView } from "../../popupView/PopupView.tsx";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { PickerItemType } from "./PickerItem.tsx";
import { DropdownPickerHeader } from "./dropdown/DropdownPickerHeader.tsx";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { DropdownPickerFooter } from "./dropdown/DropdownPickerFooter.tsx";
import { debounce } from "es-toolkit";
import { scheduleOnRN } from "react-native-worklets";

type ConditionalDropdownPickerProps<Item, DB> = | {
    /** Used when the dropdown fetches data with pagination */
    paginator: Paginator<Item, PickerItemType, DB>
    /** The key of the item property used for search filtering in the paginator. */
    searchBy?: keyof Item
    /** Used when the dropdown has static data and no pagination is required */
    data?: never
} | {
    paginator?: never
    searchBy?: never
    data: Array<PickerItemType>
}

type CommonDropdownPickerProps = {
    /** The item that will be selected by default on first render */
    defaultSelectedItemValue?: string
    /** Callback function for set the selected value outside the dropdown picker **/
    setValue?: (value: string) => void
    /** When true, the search bar will be displayed above the list */
    searchBarEnabled?: boolean
    /** Placeholder text shown inside the search bar input */
    searchBarPlaceholder?: string
    /** When true, items are rendered in a masonry-style layout */
    masonry?: boolean
    /** Number of columns to display when using masonry layout */
    numColumns?: number
    /** When item selected menu automatically submit the result and close itself */
    selectWithoutSubmit?: boolean
    /** The title displayed at the top of the dropdown menu */
    title?: string
} & Omit<DropdownPickerControllerProps, "selectedItem" | "toggleDropdown">;

export type DropdownPickerProps<Item, DB> =
    ConditionalDropdownPickerProps<Item, DB> & CommonDropdownPickerProps;

const DropdownPicker = <Item, DB = DatabaseType, >({
    title,
    data,
    paginator,
    searchBy,
    searchBarEnabled = true,
    selectWithoutSubmit = false,
    icon,
    searchBarPlaceholder,
    inputPlaceholder,
    masonry,
    numColumns,
    defaultSelectedItemValue,
    setValue,
    disabled,
    disabledText,
    hiddenBackground,
    containerStyle,
    textInputStyle
}: DropdownPickerProps<Item, DB>) => {
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field.onChange;
    const inputFieldValue = inputFieldContext?.field?.value?.toString() ?? defaultSelectedItemValue;

    const IS_STATIC = !!data;

    const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
    const [items, setItems] = useState<Array<PickerItemType>>([]);
    const [selectedItem, setSelectedItem] = useState<PickerItemType | null>(null);
    const [tmpSelectedItem, setTmpSelectedItem] = useState<PickerItemType | null>(selectedItem);
    const [searchTerm, setSearchTerm] = useState("");

    const isOpened = useSharedValue(false);

    const fetchBySearching = useCallback(() => {
        if(!searchBy) return;

        paginator?.replaceFilter({
            groupKey: "search",
            filter: {
                field: searchBy,
                operator: "like",
                value: `%${ searchTerm.toLowerCase() }%`
            }
        }).then(result => setItems(result));
    }, [paginator, searchTerm]);

    const staticSearching = useCallback(() => {
        if(!IS_STATIC || !data) return;

        if(searchTerm === "" && data.length !== items.length) return setItems(data);
        setItems(data.filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [IS_STATIC, data, searchTerm]);

    const fetchByScrolling = useCallback(async (direction: "next" | "prev" = "next") => {
        if(!initialLoadCompleted || !paginator) return;

        let result: Array<PickerItemType> | null = [];
        switch(direction) {
            case "next":
                result = await paginator.next();
                break;
            case "prev":
                result = await paginator.previous();
                break;
        }

        if(!result || result.length === 0) return;

        setItems(prevState => {
            switch(direction) {
                case "next":
                    return [...prevState, ...result];
                case "prev":
                    return [...result, ...prevState];
                default:
                    return [...prevState];
            }
        });
    }, [initialLoadCompleted, paginator]);

    const debouncedFilter = useMemo(
        () => debounce(IS_STATIC ? staticSearching : fetchBySearching, 200),
        [staticSearching, fetchBySearching]
    );

    useAnimatedReaction(() => isOpened.value, (opened) => {
        if(opened) scheduleOnRN(setTmpSelectedItem, selectedItem); //reset tmp selected item after reopen
    });

    useEffect(() => {
        if(!initialLoadCompleted) return;
        if(!inputFieldValue || inputFieldValue === "") return setSelectedItem(null);

        const item = items.find(item => item.value.toString() === inputFieldValue.toString());
        if(item && item !== selectedItem) setSelectedItem(item);
    }, [items, inputFieldValue, initialLoadCompleted]);

    useEffect(() => {
        if(!data && !paginator) throw new Error("DropdownPicker did not get Data nor Paginator");

        if(searchTerm !== "") setSearchTerm("");

        if(IS_STATIC && data) {
            setItems(data);

            if(!initialLoadCompleted) setInitialLoadCompleted(true);
        }

        if(paginator) {
            paginator.initial(inputFieldValue).then(result => {
                setItems(result);
                if(!initialLoadCompleted) setInitialLoadCompleted(true);
            });
        }
    }, [data, paginator, inputFieldValue]);

    useEffect(() => {
        if(!initialLoadCompleted) return;

        debouncedFilter();
        return () => debouncedFilter.cancel();
    }, [searchTerm]);

    const togglePopup = useCallback(() => {
        isOpened.value = true;
    }, []);

    const submit = useCallback((item: PickerItemType | null) => {
        setSelectedItem(item);

        const value = item?.value ?? "";
        if(onChange) onChange(value);
        if(setValue) setValue(value);

        isOpened.value = false;
    }, [onChange, setValue]);

    const onSelect = useCallback((item: PickerItemType) => {
        if(selectWithoutSubmit) return submit(item);

        if(tmpSelectedItem?.value === item.value) return setTmpSelectedItem(null);
        setTmpSelectedItem(item);
    }, [selectWithoutSubmit, submit, tmpSelectedItem]);

    const onSubmit = useCallback(() => {
        submit(tmpSelectedItem);
    }, [submit, tmpSelectedItem]);

    return (
        <>
            <DropdownPickerController
                selectedItem={ selectedItem }
                toggleDropdown={ togglePopup }
                icon={ icon }
                inputPlaceholder={ inputPlaceholder }
                disabled={ disabled }
                disabledText={ disabledText }
                hiddenBackground={ hiddenBackground }
                containerStyle={ containerStyle }
                textInputStyle={ textInputStyle }
            />
            <PopupView opened={ isOpened }>
                <DropdownPickerHeader
                    title={ title }
                    searchTerm={ searchTerm }
                    setSearchTerm={ setSearchTerm }
                    searchBarEnabled={ searchBarEnabled }
                    searchBarPlaceholder={ searchBarPlaceholder }
                />
                <DropdownPickerItems
                    items={ items }
                    fetchByScrolling={ IS_STATIC ? null : fetchByScrolling }
                    fetchingEnabled={ IS_STATIC ? false : initialLoadCompleted }
                    maintainVisibleContentPosition={ { disabled: true } }
                    selectedItem={ tmpSelectedItem }
                    onSelect={ onSelect }
                    searchTerm={ searchTerm }
                    masonry={ masonry }
                    numColumns={ numColumns }
                />
                {
                    !selectWithoutSubmit &&
                   <DropdownPickerFooter onSubmit={ onSubmit }/>
                }
            </PopupView>
        </>
    );
};

export default DropdownPicker;