import { PickerItemType } from "../components/Input/picker/PickerItem.tsx";

export type RawPickerElement = Partial<PickerItemType>

export const generatePickerItems = (items: Array<RawPickerElement> | Array<PickerItemType>): Array<PickerItemType> => {
    return items.map((item, index) => ({
        ...item,
        value: item.value ?? item.title
    }));
};

export type ToPickerItemsSelectors<Data> = { [Key in keyof PickerItemType]?: keyof Data }

export const toPickerItems = <Data>(
    data: Array<Data>,
    selectors: ToPickerItemsSelectors<Data>
): Array<PickerItemType> => {
    const pickerItems: Array<PickerItemType> = [];

    data.map((item, index) => {
        let value: string;
        let title: string;
        const subtitle = selectors.subtitle && item[selectors.subtitle];

        if(typeof item === "string") {
            title = item;
        } else if(selectors.title) {
            title = item[selectors.title];
        }

        if(selectors.value) value = item[selectors.value];
        if(!value) value = title ?? `element-${ index }`;
        if(!title) title = value;

        pickerItems.push({
            value,
            title,
            subtitle
        });
    });

    return pickerItems;
};