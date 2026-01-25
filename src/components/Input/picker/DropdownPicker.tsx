import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import DropdownPickerController, { DropdownPickerControllerProps } from "./dropdown/DropdownPickerController.tsx";
import DropdownPickerItems from "./dropdown/DropdownPickerItems.tsx";
import { PopupView } from "../../popupView/PopupView.tsx";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { PickerItemType } from "./PickerItem.tsx";
import { DropdownPickerHeader } from "./dropdown/DropdownPickerHeader.tsx";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { DropdownPickerFooter } from "./dropdown/DropdownPickerFooter.tsx";
import { debounce } from "es-toolkit";
import {
    ExtractColumnsFromQuery,
    ExtractRowFromQuery,
    useInfiniteQuery,
    UseInfiniteQueryOptions
} from "../../../database/hooks/useInfiniteQuery.ts";
import { SelectQueryBuilder } from "kysely";
import { scheduleOnRN } from "react-native-worklets";

type ConditionalProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> =
    | {
    queryOptions: UseInfiniteQueryOptions<QueryBuilder, PickerItemType, TableItem, Columns>
    searchBy: Columns
    renderCreateItemForm?: (callback: () => void) => ReactElement
    data?: never
}
    | {
    queryOptions?: never
    searchBy?: never
    renderCreateItemForm?: never
    data: Array<PickerItemType>
};

export type CommonDropdownPickerProps =
    Omit<DropdownPickerControllerProps, "selectedItem" | "toggleDropdown">
    &
    {
        defaultSelectedItemValue?: string
        setValue?: (value: string) => void
        searchBarEnabled?: boolean
        searchBarPlaceholder?: string
        masonry?: boolean
        numColumns?: number
        selectWithoutSubmit?: boolean
        title?: string
        popUpView?: boolean
        hideController?: boolean
    }

export type DropdownPickerProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = ConditionalProps<QueryBuilder, TableItem, Columns> & CommonDropdownPickerProps;

export default function DropdownPicker<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(props: DropdownPickerProps<QueryBuilder, TableItem, Columns>) {
    const {
        title,
        data,
        queryOptions,
        searchBy,
        renderCreateItemForm,
        searchBarEnabled = true,
        selectWithoutSubmit = false,
        icon,
        searchBarPlaceholder,
        inputPlaceholder,
        masonry,
        numColumns,
        defaultSelectedItemValue,
        setValue,
        popUpView = true,
        hideController,
        disabled,
        disabledText,
        hiddenBackground,
        containerStyle,
        textInputStyle
    } = props;

    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field.onChange;
    const inputFieldValue = inputFieldContext?.field?.value?.toString() ?? defaultSelectedItemValue;
    const error = inputFieldContext?.fieldState?.error;

    const [selectedItem, setSelectedItem] = useState<PickerItemType | null>(null);
    const [tmpSelectedItem, setTmpSelectedItem] = useState<PickerItemType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const isOpened = useSharedValue(false);

    const queryArgs = useMemo(() => {
        if(!queryOptions) return null;

        return {
            ...queryOptions,
            defaultItem: inputFieldValue ? {
                idValue: inputFieldValue,
                idField: (queryOptions.idField || "id") as keyof TableItem
            } : undefined
        };
    }, [queryOptions, inputFieldValue]);

    const query = useInfiniteQuery(queryArgs);

    const items = useMemo(() => {
        if(queryOptions) return query.data ?? [];
        if(data) {
            if(!searchTerm) return data;
            return data.filter(i => i.title?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return [];
    }, [query.data, data, searchTerm, !!queryOptions]);

    const foundItem = useMemo(() => {
        return items.find(i => i.value.toString() === inputFieldValue?.toString());
    }, [items, inputFieldValue]);

    const isSelectedValueMissing = useMemo(() => {
        if(!inputFieldValue) return false;
        return !foundItem;
    }, [inputFieldValue, foundItem]);

    const isLoadingSelectedItem = useMemo(
        () => query?.isLoading && isSelectedValueMissing,
        [isSelectedValueMissing, query.isLoading]
    );

    useEffect(() => {
        if(selectedItem?.value !== foundItem?.value) setSelectedItem(foundItem ?? null);
    }, [foundItem]);

    useAnimatedReaction(() => isOpened.value, (opened) => {
        if(opened) scheduleOnRN(setTmpSelectedItem, selectedItem); //reset tmp selected item after reopen
    });

    const handleSearch = useCallback((searchTerm: string) => {
        if(!queryOptions || !searchBy) return;

        query.replaceFilter({
            groupKey: "search",
            filter: {
                field: searchBy,
                operator: "like",
                value: `%${ searchTerm.toLowerCase() }%`
            }
        });
    }, [searchTerm, !!queryOptions, query.replaceFilter]);

    const debouncedSearch = useMemo(() => debounce(handleSearch, 450), [handleSearch]);

    useEffect(() => {
        if(queryOptions) debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm, !!queryOptions, debouncedSearch]);

    const submit = useCallback((item: PickerItemType | null) => {
        setSelectedItem(item);
        const val = item?.value ?? "";
        onChange?.(val);
        setValue?.(val);
        isOpened.value = false;
    }, [onChange, setValue]);

    const onSelect = useCallback((item: PickerItemType) => {
        if(selectWithoutSubmit) return submit(item);
        setTmpSelectedItem(prev => prev?.value === item.value ? null : item);
    }, [selectWithoutSubmit, submit]);

    const initialStartIndex =
        queryOptions
        ? query.initialStartIndex
        : data && selectedItem
          ? data.findIndex(i => i.value === selectedItem.value)
          : 0;

    const renderContent = () => (
        <>
            <DropdownPickerHeader
                title={ title }
                renderCreateItemForm={
                    renderCreateItemForm
                    ? () => renderCreateItemForm(() => query.clearFilters())
                    : undefined
                }
                searchTerm={ searchTerm }
                setSearchTerm={ setSearchTerm }
                searchBarEnabled={ searchBarEnabled }
                searchBarPlaceholder={ searchBarPlaceholder }
            />
            <DropdownPickerItems
                items={ items }
                initialStartIndex={ initialStartIndex }
                fetchNext={ queryOptions ? query.fetchNext : null }
                fetchPrev={ queryOptions ? query.fetchPrev : null }
                isLoading={ queryOptions ? query.isLoading : false }
                isNextFetchingEnabled={
                    queryOptions
                    ? (!query.isLoading && query.hasNext && !query.isNextFetching)
                    : false
                }
                isPrevFetchingEnabled={
                    queryOptions
                    ? (!query.isLoading && query.hasPrev && !query.isPrevFetching)
                    : false
                }
                selectedItem={ tmpSelectedItem }
                onSelect={ onSelect }
                searchTerm={ searchTerm }
                masonry={ masonry }
                numColumns={ numColumns }
            />
            {
                !selectWithoutSubmit &&
               <DropdownPickerFooter onSubmit={ () => submit(tmpSelectedItem) }/>
            }
        </>
    );

    return (
        <>
            {
                !hideController &&
               <DropdownPickerController
                  selectedItem={ selectedItem }
                  isSelectedItemLoading={ isLoadingSelectedItem }
                  toggleDropdown={ () => { isOpened.value = true; } }
                  icon={ icon }
                  inputPlaceholder={ inputPlaceholder }
                  error={ !!error }
                  disabled={ disabled }
                  disabledText={ disabledText }
                  hiddenBackground={ hiddenBackground }
                  containerStyle={ containerStyle }
                  textInputStyle={ textInputStyle }
               />
            }
            {
                popUpView
                ? <PopupView opened={ isOpened }>{ renderContent() }</PopupView>
                : renderContent()
            }
        </>
    );
}