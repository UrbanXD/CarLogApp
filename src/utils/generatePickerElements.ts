import { PickerElement } from "../components/Input/picker/PickerItem.tsx";

type RawPickerElements = Array<Omit<PickerElement, "id">> | Array<PickerElement>
export const generatePickerElements = (items: RawPickerElements): Array<PickerElement> => {
    return items.map((item, index) => ({
        ...item,
        id: item.id ?? `${ index }-${ item.title }-${ item.value }`,
        value: item.value ?? item.title
    }));
};

export const transformToPickerElements = (
    data: any,
    titleSelector?: string,
    subtitleSelector?: string,
    valueSelector?: string
): Array<PickerElement> => {
    const xd: Array<PickerElement> = [];
    data.map((item: any, index: number) => {
        const title = titleSelector ? item[titleSelector] : typeof item === "string" ? item : `element-${ index }`;
        xd.push({
            id: item.id ?? `${ index }-${ title }`,
            title: title,
            subtitle: subtitleSelector && item[subtitleSelector],
            value: valueSelector ? item[valueSelector] : title
        });
    });
    return xd;
};