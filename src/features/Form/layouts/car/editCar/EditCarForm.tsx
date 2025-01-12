import React from "react";
import useEditCarForm from "./useEditCar";
import { CarTableType } from "../../../../Database/connector/powersync/AppSchema";
import EditForm from "../../../components/EditForm";

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
    const restProps =
        useEditCarForm(car, forceCloseBottomSheet, carImage);

    return (
        <EditForm
            stepIndex={ stepIndex }
            { ...restProps }
        />
    )
}

export default EditCarForm;