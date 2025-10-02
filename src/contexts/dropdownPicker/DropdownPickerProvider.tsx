import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { PickerItemType } from "../../components/Input/picker/PickerItem.tsx";
import { DropdownPickerContext } from "./DropdownPickerContext.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { PickerDisabledToast } from "../../ui/alert/presets/toast/index.ts";
import { debounce } from "es-toolkit";
import { useInputFieldContext } from "../inputField/InputFieldContext.ts";
import { DropdownPickerProps } from "../../components/Input/picker/DropdownPicker.tsx";
import { DropdownPickerControllerProps } from "../../components/Input/picker/DropdownPickerController.tsx";
import { toPickerItem, toPickerItems } from "../../utils/toPickerItems.ts";

type DropdownPickerProviderProps<Item, DB> =
    { children: ReactElement }
    & Omit<DropdownPickerProps<Item, DB>, DropdownPickerControllerProps>

export function DropdownPickerProvider<Item, DB>({
    children,
    data,
    paginator,
    searchBy,
    dataTransformSelectors,
    defaultSelectedItem,
    setValue,
    onDropdownToggle,
    disabled,
    disabledText,
    alwaysShowItems,
    alwaysShowInput = true,
    searchBarEnable = true
}: DropdownPickerProviderProps<Item, DB>) {
    const IS_STATIC = !!data;

    const { openToast } = useAlert();
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field.onChange;
    const inputFieldValue = inputFieldContext?.field?.value?.toString();

    const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
    const [items, setItems] = useState<Array<PickerItemType>>([]);
    const [selectedItem, setSelectedItem] = useState<PickerItemType | null>(null);
    const [showItems, setShowItems] = useState<boolean>(!!alwaysShowItems);
    const [searchTerm, setSearchTerm] = useState("");

    const findItemByValue = useCallback((items: Array<PickerItemType>, value?: string) => {
        return items.find(item => item.value === value);
    }, []);

    const onSelect = useCallback((value: string) => {
        const item = findItemByValue(items, value);
        if(!item) return;

        if(onChange) onChange(item.value);
        if(setValue) setValue(item.value);
        setSelectedItem(item);
    }, [findItemByValue, items]);

    const fetchBySearching = useCallback(() => {
        if(!searchBy) return;

        paginator?.filter({
            field: searchBy,
            operator: "like",
            value: `%${ searchTerm.toLowerCase() }%`,
            toLowerCase: true
        }).then(result => {
            setItems(toPickerItems<Item>(result, dataTransformSelectors));
        });
    }, [paginator, searchTerm]);

    const staticSearching = useCallback(() => {
        if(!IS_STATIC || !data) return;

        if(searchTerm === "" && data.length !== items.length) return setItems(data);
        setItems(data.filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [IS_STATIC, data, searchTerm]);

    const fetchByScrolling = useCallback(async (direction: "next" | "prev" = "next") => {
        if(!initialLoadCompleted || !paginator) return;

        let rawResult: Array<Item> | null = [];
        switch(direction) {
            case "next":
                rawResult = await paginator.next();
                break;
            case "prev":
                rawResult = await paginator.previous();
                break;
        }

        if(!rawResult || rawResult.length === 0) return;

        setItems(prevState => {
            switch(direction) {
                case "next":
                    return [...prevState, ...toPickerItems<Item>(rawResult, dataTransformSelectors)];
                case "prev":
                    return [...toPickerItems<Item>(rawResult, dataTransformSelectors), ...prevState];
                default:
                    return [...prevState];
            }
        });
    }, [initialLoadCompleted, paginator]);

    const debouncedFilter = useMemo(
        () => debounce(IS_STATIC ? staticSearching : fetchBySearching, 300),
        [staticSearching, fetchBySearching]
    );

    useEffect(() => {
        if(!defaultSelectedItem) return;

        setSelectedItem(toPickerItem<Item>(defaultSelectedItem, dataTransformSelectors));
    }, [defaultSelectedItem]);

    useEffect(() => {
        if(!data && !paginator) throw new Error("DropdownPicker did not get Data nor Paginator");

        if(showItems) setShowItems(false);
        if(searchTerm !== "") setSearchTerm("");

        if(IS_STATIC && data) {
            const transformedData = toPickerItems<Item>(data, dataTransformSelectors);
            setItems(transformedData);

            if(!initialLoadCompleted) setInitialLoadCompleted(true);
        }

        if(paginator) {
            paginator.initial().then(result => {
                setItems(toPickerItems<Item>(result, dataTransformSelectors));
                if(!initialLoadCompleted) setInitialLoadCompleted(true);
            });
        }
    }, [data, paginator]);

    useEffect(() => {
        if(!initialLoadCompleted) return;

        setSelectedItem(findItemByValue(items, inputFieldValue));
    }, [items, inputFieldValue, initialLoadCompleted]);

    useEffect(() => {
        if(!initialLoadCompleted) return;
        debouncedFilter();
        return () => debouncedFilter.cancel();
    }, [searchTerm]);

    useEffect(() => {
        if(onDropdownToggle) onDropdownToggle(showItems);
    }, [showItems]);

    const toggleDropdown = () => {
        if(disabled) return openToast(PickerDisabledToast.warning(disabledText));
        if(!!alwaysShowItems) return;

        setShowItems(prevState => !prevState);
    };

    return (
        <DropdownPickerContext.Provider
            value={ {
                items,
                fetchByScrolling: IS_STATIC ? null : fetchByScrolling,
                fetchingEnabled: IS_STATIC ? false : initialLoadCompleted,
                selectedItem,
                onSelect,
                toggleDropdown,
                searchTerm,
                setSearchTerm,
                disabled,
                showItems,
                alwaysShowInput,
                searchBarEnable
            } }
        >
            { children }
        </DropdownPickerContext.Provider>
    );
};