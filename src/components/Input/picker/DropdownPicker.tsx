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
import { useWatchedQueryItem, UseWatchedQueryItemProps } from "../../../database/hooks/useWatchedQueryItem.ts";

type ConditionalProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> =
    | {
    queryOptions: UseInfiniteQueryOptions<QueryBuilder, PickerItemType, TableItem, Columns>
    searchBy: Array<Columns> | Columns
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

    const [tmpSelectedItem, setTmpSelectedItem] = useState<PickerItemType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const isOpened = useSharedValue(false);

    const itemsQueryProps = useMemo(() => {
        if(!queryOptions) return null;

        return {
            ...queryOptions,
            defaultItem: inputFieldValue ? {
                idValue: inputFieldValue,
                idField: (queryOptions.idField || "id") as keyof TableItem
            } : undefined
        };
    }, [queryOptions, inputFieldValue]);

    const selectedItemQueryProps = useMemo(() => {
        if(!queryOptions) return null;

        const watchedQuery: UseWatchedQueryItemProps<PickerItemType, TableItem> = {
            query: queryOptions.baseQuery.where((queryOptions.idField ?? "id") as string, "=", inputFieldValue),
            mapper: queryOptions.mapper,
            options: { enabled: !!inputFieldValue }
        };

        return watchedQuery;
    }, [queryOptions, inputFieldValue]);

    const itemsQuery = useInfiniteQuery(itemsQueryProps);
    const { data: selectedItem, isLoading: isLoadingSelectedItem } = useWatchedQueryItem(selectedItemQueryProps);

    const items = useMemo(() => {
        if(queryOptions) return itemsQuery.data ?? [];
        if(data) {
            if(!searchTerm) return data;
            return data.filter(i => i.title?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return [];
    }, [itemsQuery.data, data, searchTerm, !!queryOptions]);

    useAnimatedReaction(
        () => isOpened.value,
        (opened, previousOpened) => {
            if(opened && !previousOpened) { //reset tmp selected item after reopen
                scheduleOnRN(setTmpSelectedItem, selectedItem);
            }
        },
        [selectedItem]
    );

    const handleSearch = useCallback((searchTerm: string) => {
        if(!queryOptions || !searchBy) return;

        const searchFields = Array.isArray(searchBy) ? searchBy : [searchBy];

        searchFields.forEach((searchField) => {
            itemsQuery.replaceFilter({
                groupKey: "search",
                filter: {
                    field: searchField,
                    operator: "like",
                    value: `%${ searchTerm.toLowerCase() }%`
                },
                logic: "OR"
            });
        });
    }, [searchTerm, !!queryOptions, itemsQuery.replaceFilter]);

    const debouncedSearch = useMemo(() => debounce(handleSearch, 450), [handleSearch]);

    useEffect(() => {
        if(queryOptions) debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm, !!queryOptions, debouncedSearch]);

    const submit = useCallback((item: PickerItemType | null) => {
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
        ? itemsQuery.initialStartIndex
        : data && selectedItem
          ? data.findIndex(i => i.value === selectedItem.value)
          : 0;

    const renderContent = () => (
        <>
            <DropdownPickerHeader
                title={ title }
                renderCreateItemForm={
                    renderCreateItemForm
                    ? () => renderCreateItemForm(() => itemsQuery.clearFilters())
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
                fetchNext={ queryOptions ? itemsQuery.fetchNext : null }
                fetchPrev={ queryOptions ? itemsQuery.fetchPrev : null }
                isLoading={ queryOptions ? itemsQuery.isLoading : false }
                isNextFetchingEnabled={
                    queryOptions
                    ? (!itemsQuery.isLoading && itemsQuery.hasNext && !itemsQuery.isNextFetching)
                    : false
                }
                isPrevFetchingEnabled={
                    queryOptions
                    ? (!itemsQuery.isLoading && itemsQuery.hasPrev && !itemsQuery.isPrevFetching)
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