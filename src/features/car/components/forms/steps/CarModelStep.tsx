import React, { useEffect, useRef, useState } from "react";
import { CARS, DATA_TRANSFORM_TO_PICKER_DATA } from "../../../../../constants/index.ts";
import { InputPickerDataType } from "../../../../Form/components/Input/picker/InputPicker.tsx";
import { useWatch } from "react-hook-form";
import Input from "../../../../Form/components/Input/Input.ts";
import { StepProps } from "../../../../../types/index.ts";

const CarModelStep: React.FC<StepProps> = ({
    control,
    resetField
}) => {
    const [isBrandSelected, setIsBrandSelected] = useState(false);
    const [brands] = useState(DATA_TRANSFORM_TO_PICKER_DATA(Object.keys(CARS)));
    const [models, setModels] = useState<Array<InputPickerDataType>>([]);

    const selectedBrandName = useRef<string>("");

    const selectedBrandNameValue = useWatch({
        control,
        name: "brand"
    });

    useEffect(() => {
        if (selectedBrandName.current !== selectedBrandNameValue && resetField){
            resetField("model", { keepError: true });
            selectedBrandName.current = selectedBrandNameValue;
        }

        setIsBrandSelected(selectedBrandNameValue !== "");
        setModels(DATA_TRANSFORM_TO_PICKER_DATA(CARS[selectedBrandNameValue] || [], "name"));
    }, [selectedBrandNameValue, resetField]);

    return (
        <Input.Group>
            <Input.Picker
                data={ brands }
                control={ control }
                fieldName="brand"
                fieldNameText="Márka"
                withSearchbar
            />
            <Input.Picker
                key={ JSON.stringify(models) }
                data={ models }
                control={ control }
                fieldName="model"
                fieldNameText="Modell"
                withSearchbar
                disabled={ !isBrandSelected }
                disabledText={ "Először válassza ki az autó márkáját!" }
            />
        </Input.Group>
    )
}

export default CarModelStep;