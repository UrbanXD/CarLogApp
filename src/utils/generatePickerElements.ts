import { PickerElement } from "../components/Input/picker/PickerItem.tsx";

type RawPickerElements = Array<Omit<PickerElement, "id">> | Array<PickerElement>
export const generatePickerElements = (items: RawPickerElements): Array<PickerElement> => {
    return items.map((item, index) => ({
        ...item,
        id: item.id ?? `${ index }-${ item.title }-${ item.value }`
    }));
};