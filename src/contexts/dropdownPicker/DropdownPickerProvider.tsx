import React, { ProviderProps, useCallback, useEffect, useMemo, useState } from "react";
import { PickerItemType } from "../../components/Input/picker/PickerItem.tsx";
import { DropdownPickerContext } from "./DropdownPickerContext.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { PickerDisabledToast } from "../../ui/alert/presets/toast/index.ts";
import { debounce } from "es-toolkit";
import { useInputFieldContext } from "../inputField/InputFieldContext.ts";
import { DropdownPickerProps } from "../../components/Input/picker/DropdownPicker.tsx";
import { DropdownPickerControllerProps } from "../../components/Input/picker/DropdownPickerController.tsx";
import { ControllerRenderArgs } from "../../constants/index.ts";

type DropdownPickerProviderProps = Omit<DropdownPickerProps, DropdownPickerControllerProps>

export const DropdownPickerProvider: React.FC<ProviderProps<DropdownPickerProviderProps>> = ({
    children,
    value: {
        data,
        fetchData,
        defaultSelectedValue = "af",
        setValue,
        onDropdownToggle,
        disabled,
        disabledText,
        alwaysShowItems,
        alwaysShowInput = true
    }
}) => {
    const IS_STATIC = !!data;
    const PER_PAGE = 50;

    const { openToast } = useAlert();
    const {
        field: { onChange, value: inputFieldValue },
        fieldState: { isDirty: inputFieldDirty }
    } = useInputFieldContext() ?? {} as ControllerRenderArgs;

    const [items, setItems] = useState<Array<PickerItemType>>([]);
    const [page, setPage] = useState(0);
    const [selectedItem, setSelectedItem] = useState<PickerItemType | null>(null);
    const [showItems, setShowItems] = useState<boolean>(!!alwaysShowItems);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsFiltered, setItemsFiltered] = useState(false);

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
        setPage(_ => {
            const nextPage = 0; //back to first page

            setItemsFiltered(true);
            const search = searchTerm.length > 0 ? searchTerm : undefined;

            fetchData({ searchTerm: search, pagination: { page: nextPage, perPage: PER_PAGE } })
            .then(result => setItems(
                prevState => {
                    const newState = [
                        ...prevState.filter(item => result.includes(item))
                    ];
                    return [
                        ...newState,
                        ...result.filter(resultItem => !newState.includes(resultItem))
                    ];
                }
            ));

            return nextPage;
        });
    }, [fetchData, searchTerm]);

    const staticSearching = useCallback(() => {
        if(!IS_STATIC || !data) return;

        if(searchTerm === "" && data.length !== items.length) return setItems(data);
        setItems(data.filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [IS_STATIC, data, searchTerm]);

    const fetchByScrolling = useCallback(() => {
        setPage(prevPage => {
            const nextPage = prevPage + 1;

            const search = searchTerm.length > 0 ? searchTerm : undefined;

            fetchData({ searchTerm: search, pagination: { page: nextPage, perPage: PER_PAGE } })
            .then(result => setItems(prevState => {
                const allNewItems = [...prevState, ...result];
                return allNewItems.filter((
                    item,
                    index,
                    self
                ) => index === self.findIndex(i => i.value === item.value));
            }));

            return nextPage;
        });
    }, [fetchData, page, searchTerm]);

    const debouncedFilter = useMemo(
        () => debounce(IS_STATIC ? staticSearching : fetchBySearching, 350),
        [staticSearching, fetchBySearching]
    );

    useEffect(() => {
        if(IS_STATIC && data) {
            setItems(data);
            if(data.length <= 0) return;

            const defaultItem = findItemByValue(data, defaultSelectedValue);
            if(defaultItem) setSelectedItem(defaultItem);
        }

        fetchData({ pagination: { page, perPage: PER_PAGE } })
        .then(result => {
            setItems(result);
            if(result.length <= 0) return;

            /*itt gond les, hogy ha nincs benne az elso X-be akkor baj so meg kell valositani amajd*/
            const defaultItem = findItemByValue(result, defaultSelectedValue);
            if(defaultItem) setSelectedItem(defaultItem);
        });
    }, [fetchData]);

    useEffect(() => {
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
                selectedItem,
                onSelect,
                toggleDropdown,
                searchTerm,
                setSearchTerm,
                itemsFiltered,
                setItemsFiltered,
                disabled,
                showItems,
                alwaysShowInput
            } }
        >
            { children }
        </DropdownPickerContext.Provider>
    );
};