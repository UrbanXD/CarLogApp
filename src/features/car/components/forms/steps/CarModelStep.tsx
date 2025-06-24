import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CARS, ICON_NAMES } from "../../../../../constants/index.ts";
import { transformToPickerElements } from "../../../../../utils/generatePickerElements.ts";

const CarModelStep: React.FC<StepProps> = ({
    control,
    resetField
}) => {
    const [isBrandSelected, setIsBrandSelected] = useState(false);
    const selectedBrandName = useRef<string>("");
    const selectedBrandNameValue = useWatch({
        control,
        name: "brand"
    });

    const brands = useMemo(() => transformToPickerElements(Object.keys(CARS)), []);
    const models = useMemo(
        () => transformToPickerElements(CARS[selectedBrandNameValue] || [], "name"),
        [selectedBrandNameValue]
    );

    useEffect(() => {
        if(selectedBrandName.current !== selectedBrandNameValue && resetField) {
            resetField("model", { keepError: true });
            selectedBrandName.current = selectedBrandNameValue;
        }

        setIsBrandSelected(selectedBrandNameValue !== "");
    }, [selectedBrandNameValue, resetField]);

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="brand"
                fieldNameText="Márka"
            >
                <Input.Picker.Dropdown
                    elements={ brands }
                    icon={ ICON_NAMES.car }
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="model"
                fieldNameText="Modell"
            >
                <Input.Picker.Dropdown
                    elements={ models }
                    icon={ ICON_NAMES.car }
                    disabled={ !isBrandSelected }
                    disabledText="Először válassza ki az autó márkáját!"
                />
            </Input.Field>
        </Input.Group>
    );
};

export default CarModelStep;