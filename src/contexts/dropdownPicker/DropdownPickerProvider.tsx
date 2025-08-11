import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { PickerItemType } from "../../components/Input/picker/PickerItem.tsx";
import { DropdownPickerContext } from "./DropdownPickerContext.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { PickerDisabledToast } from "../../ui/alert/presets/toast/index.ts";
import { debounce } from "es-toolkit";
import { useInputFieldContext } from "../inputField/InputFieldContext.ts";
import { DropdownPickerProps } from "../../components/Input/picker/DropdownPicker.tsx";
import { DropdownPickerControllerProps } from "../../components/Input/picker/DropdownPickerController.tsx";
import { ControllerRenderArgs } from "../../constants/index.ts";
import { toPickerItem, toPickerItems } from "../../utils/toPickerItems.ts";

type DropdownPickerProviderProps<Item, DB> =
    { children: ReactElement }
    & Omit<DropdownPickerProps<Item, DB>, DropdownPickerControllerProps>

export function DropdownPickerProvider<Item, DB>({
    children,
    data,
    paginator,
    dataTransformSelectors,
    defaultSelectedItem,
    setValue,
    onDropdownToggle,
    disabled,
    disabledText,
    alwaysShowItems,
    alwaysShowInput = true
}: DropdownPickerProviderProps<Item, DB>) {
    const IS_STATIC = !!data;

    const { openToast } = useAlert();
    const {
        field: { onChange, value: inputFieldValue },
        fieldState: { isDirty: inputFieldDirty }
    } = useInputFieldContext() ?? { field: {}, fieldState: {} } as ControllerRenderArgs;

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
        paginator?.filter(searchTerm).then(result => {
            setItems(toPickerItems<Item>(result, dataTransformSelectors));
        });
    }, [searchTerm, paginator]);

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
                rawResult = await paginator.next(searchTerm);
                break;
            case "prev":
                rawResult = await paginator.previous(searchTerm);
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
    }, [searchTerm, initialLoadCompleted, paginator]);

    const debouncedFilter = useMemo(
        () => debounce(IS_STATIC ? staticSearching : fetchBySearching, 350),
        [staticSearching, fetchBySearching]
    );

    useEffect(() => {
        if(!defaultSelectedItem) return;

        setSelectedItem(toPickerItem<Item>(defaultSelectedItem, dataTransformSelectors));
    }, [defaultSelectedItem]);

    useEffect(() => {
        if(!data && !paginator) throw new Error("DropdownPicker did not get Data nor Paginator");

        if(IS_STATIC && data) {
            const transformedData = toPickerItems<Item>(data, dataTransformSelectors);
            setItems(transformedData);
            setInitialLoadCompleted(true);
        }

        if(paginator) {
            paginator.initial().then(result => {
                const transformedData = toPickerItems<Item>(result, dataTransformSelectors);
                setItems(transformedData);
                setInitialLoadCompleted(true);
            });
        }
    }, []);

    useEffect(() => {
        if(!initialLoadCompleted) return;
        debouncedFilter();
        return () => debouncedFilter.cancel();
    }, [searchTerm]);

    useEffect(() => {
        if(!inputFieldDirty) return;
        setSelectedItem(findItemByValue(items, inputFieldValue));
    }, [inputFieldValue]);

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
                alwaysShowInput
            } }
        >
            { children }
        </DropdownPickerContext.Provider>
    );
};