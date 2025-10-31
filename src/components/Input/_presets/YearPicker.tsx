import React, { useEffect, useState } from "react";
import { MAX_DATE, MIN_DATE } from "../../../constants/index.ts";
import Input from "../Input.ts";
import { PickerItemType } from "../picker/PickerItem.tsx";
import dayjs from "dayjs";
import { DropdownPickerProps } from "../picker/DropdownPicker.tsx";

export type YearPickerProps = {
    defaultYear?: number
    minYear?: number
    maxYear?: number
    desc?: boolean
} & DropdownPickerProps

export function YearPicker({
    defaultYear = dayjs().year(),
    minYear = dayjs(MIN_DATE).year(),
    maxYear = dayjs(MAX_DATE).year(),
    desc = true,
    ...restProps
}: YearPickerProps) {
    const [years, setYears] = useState<Array<PickerItemType>>([]);

    useEffect(() => {
        const result = Array.from({ length: maxYear - minYear + 1 }, (_, key) => {
            const year = (minYear + key).toString();
            return { title: year, value: year };
        });

        setYears(desc ? result.reverse() : result);
    }, [minYear, maxYear]);

    return (
        <Input.Picker.Dropdown
            title={ restProps.title ?? "Év" }
            defaultSelectedItemValue={ defaultYear?.toString() }
            inputPlaceholder={ restProps.inputPlaceholder ?? defaultYear?.toString() }
            data={ years }
            masonry
            numColumns={ 3 }
            hiddenBackground={ true }
            { ...restProps }
        />
    );
}