import React from "react";
import useEditCarForm from "./useEditCar";
import { CarTableType } from "../../../../Database/connector/powersync/AppSchema";
import Button from "../../../../Button/components/Button";
import { ICON_NAMES } from "../../../../Shared/constants/constants";

interface EditCarFormProps {
    car: CarTableType
    carImage?: string
    stepIndex: number
    forceCloseBottomSheet: () => void
}
const EditCarForm: React.FC<EditCarFormProps> = ({
    car,
    carImage,
    stepIndex,
    forceCloseBottomSheet
}) => {
    const {
        submitHandler,
        reset,
        steps
    } = useEditCarForm(car, forceCloseBottomSheet, carImage);

    const handleSave =
        async () => await submitHandler();

    return (
        <>
            { steps[stepIndex]() }
            <Button.Row>
                <Button.Icon
                    icon={ICON_NAMES.reset}
                    onPress={ () => reset() }
                />
                <Button.Text
                    text="Mentés"
                    onPress={ handleSave }
                    style={{ flex: 0.9 }}
                />
            </Button.Row>
        </>
    )
}

export default EditCarForm;