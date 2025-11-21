import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";
import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { PickerItemType } from "../../../../../components/Input/picker/PickerItem.tsx";
import useCars from "../../../hooks/useCars.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import i18n from "../../../../../i18n/index.ts";

type CarPickerInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function CarPickerInput({
    control,
    fieldName,
    title = i18n.t("car.picker.title"),
    subtitle
}: CarPickerInputProps) {
    const { cars } = useCars();
    const { carDao } = useDatabase();

    const [carsData, setCarsData] = useState<Array<PickerItemType> | null>(null);

    useEffect(() => {
        setCarsData(carDao.mapper.dtoToPicker(cars));
    }, [cars]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title }
            fieldInfoText={ subtitle }
        >
            {
                carsData
                ?
                <Input.Picker.Dropdown
                    title={ title }
                    data={ carsData }
                    icon={ ICON_NAMES.car }
                />
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}