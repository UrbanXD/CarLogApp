import React, { useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { Paginator, StepProps } from "../../../../../types/index.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { toPickerItems } from "../../../../../utils/toPickerItems.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { CarBrandTableType, CarModelTableType } from "../../../../../database/connector/powersync/AppSchema.ts";

const CarModelStep: React.FC<StepProps> = ({
    control,
    resetField
}) => {
    const { carDAO } = useDatabase();

    const [isBrandSelected, setIsBrandSelected] = useState(false);
    const selectedBrandId = useWatch({
        control,
        name: "brandId"
    });

    const fetchBrands = async (paginator: Paginator) => {
        const brands = await carDAO.getCarBrands(paginator);
        return toPickerItems<CarBrandTableType>(brands, { value: "id", title: "name" });
    };

    const fetchModels = useCallback(async (paginator: Paginator) => {
        const models = await carDAO.getCarModels(selectedBrandId, paginator);
        return toPickerItems<CarModelTableType>(models, { value: "id", title: "name" });
    }, [selectedBrandId]);

    useEffect(() => {
        if(resetField) resetField("modelId", { keepError: true, keepDirty: true });

        setIsBrandSelected(selectedBrandId && selectedBrandId !== "");
    }, [selectedBrandId]);

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="brandId"
                fieldNameText="Márka"
            >
                <Input.Picker.Dropdown
                    fetchData={ fetchBrands }
                    icon={ ICON_NAMES.car }
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="modelId"
                fieldNameText="Modell"
            >
                <Input.Picker.Dropdown
                    fetchData={ fetchModels }
                    icon={ ICON_NAMES.car }
                    disabled={ !isBrandSelected }
                    disabledText="Először válassza ki az autó márkáját!"
                />
            </Input.Field>
        </Input.Group>
    );
};

export default CarModelStep;