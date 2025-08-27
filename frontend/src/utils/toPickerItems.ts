import { PickerItemType } from "../components/Input/picker/PickerItem.tsx";

export type RawPickerElement = Partial<PickerItemType>

export const generatePickerItems = (items: Array<RawPickerElement> | Array<PickerItemType>): Array<PickerItemType> => {
    return items.map((item) => ({
        ...item,
        value: item.value ?? item.title
    }));
};

export type ToPickerItemsSelectors<Item> = { [Key in keyof PickerItemType]?: keyof Item }

export const toPickerItems = <Item>(
    data: Array<Item>,
    selectors: ToPickerItemsSelectors<Item>
): Array<PickerItemType> => {
    const pickerItems: Array<PickerItemType> = [];

    data.map((item, index) => pickerItems.push(toPickerItem<Item>(item, selectors, index)));

    return pickerItems;
};

export const toPickerItem = <Item>(
    item: Item,
    selectors: ToPickerItemsSelectors<Item>,
    index?: number
): PickerItemType => {
    let value: string;
    let title: string;
    const subtitle = selectors.subtitle && item[selectors.subtitle];

    if(typeof item === "string") {
        title = item;
    } else if(selectors.title) {
        title = item[selectors.title];
    }

    if(selectors.value) value = item[selectors.value];
    if(!value) value = title ?? `element-${ index ?? "x" }`;
    if(!title) title = value;

    return { value, title, subtitle };
};