import { PickerElement } from "../components/Input/picker/PickerItem.tsx";

export type RawPickerElement = Partial<PickerElement>

export const generatePickerElements = (items: Array<RawPickerElement> | Array<PickerElement>): Array<PickerElement> => {
    return items.map((item, index) => ({
        ...item,
        value: item.value ?? item.title
    }));
};

export const transformToPickerElements = (
    data: Array<{ [key: string]: string }> | Array<string>,
    titleSelector?: string,
    subtitleSelector?: string,
    valueSelector?: string
): Array<PickerElement> => {
    const pickerElements: Array<PickerElement> = [];

    data.map((element, index) => {
        let value: string;
        let title: string;

        if(typeof element === "string") {
            title = element;
        } else if(titleSelector) {
            title = element[titleSelector];
        }

        if(valueSelector) value = element[valueSelector];

        if(!value) value = title ?? `element-${ index }`;
        if(!title) title = value;

        pickerElements.push({
            value,
            title,
            subtitle: subtitleSelector && element[subtitleSelector]
        });
    });

    return pickerElements;
};