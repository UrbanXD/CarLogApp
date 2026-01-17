import React, { useEffect, useState } from "react";
import { MAX_DATE, MIN_DATE } from "../../../constants/index.ts";
import Input from "../Input.ts";
import { PickerItemType } from "../picker/PickerItem.tsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { CommonDropdownPickerProps } from "../picker/DropdownPicker.tsx";

export type YearPickerProps = {
    defaultYear?: number
    minYear?: number
    maxYear?: number
    desc?: boolean
} & CommonDropdownPickerProps;

export function YearPicker({
    defaultYear = dayjs().year(),
    minYear = dayjs(MIN_DATE).year(),
    maxYear = dayjs(MAX_DATE).year(),
    desc = true,
    ...restProps
}: YearPickerProps) {
    const { t } = useTranslation();

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
            { ...restProps }
            title={ restProps.title ?? t("form.date_picker.year") }
            defaultSelectedItemValue={ defaultYear?.toString() }
            data={ years }
            masonry
            numColumns={ 3 }
        />
    );
}