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
import { toPickerItems } from "../../utils/toPickerItems.ts";

type DropdownPickerProviderProps<Data, DB> =
    { children: ReactElement }
    & Omit<DropdownPickerProps<Data, DB>, DropdownPickerControllerProps>

export function DropdownPickerProvider<Data, DB>({
    children,
    data,
    paginator,
    dataTransformSelectors,
    defaultSelectedValue = "af",
    setValue,
    onDropdownToggle,
    disabled,
    disabledText,
    alwaysShowItems,
    alwaysShowInput = true
}: DropdownPickerProviderProps<Data, DB>) {
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
            setItems(toPickerItems<Data>(result, dataTransformSelectors));
        });
    }, [searchTerm, paginator]);

    const staticSearching = useCallback(() => {
        if(!IS_STATIC || !data) return;

        if(searchTerm === "" && data.length !== items.length) return setItems(data);
        setItems(data.filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [IS_STATIC, data, searchTerm]);

    const fetchByScrolling = useCallback(async (direction: "next" | "prev" = "next") => {
        if(!initialLoadCompleted || !paginator) return;

        let rawResult: Array<Data> | null = [];
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
                    return [...prevState, ...toPickerItems<Data>(rawResult, dataTransformSelectors)];
                case "prev":
                    return [...toPickerItems<Data>(rawResult, dataTransformSelectors), ...prevState];
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
        if(!data && !paginator) throw new Error("DropdownPicker did not get Data nor Paginator");

        if(IS_STATIC && data) {
            const transformedData = toPickerItems<Data>(data, dataTransformSelectors);
            setItems(transformedData);
            setInitialLoadCompleted(true);
            if(transformedData.length === 0) return;

            const defaultItem = findItemByValue(transformedData, defaultSelectedValue);
            if(defaultItem) setSelectedItem(defaultItem);
            return;
        }

        if(paginator) {
            paginator.initial().then(result => {
                const transformedData = toPickerItems<Data>(result, dataTransformSelectors);
                setItems(transformedData);
                setInitialLoadCompleted(true);
                if(transformedData.length === 0) return;

                const defaultItem = findItemByValue(transformedData, defaultSelectedValue);
                if(defaultItem) setSelectedItem(defaultItem);
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