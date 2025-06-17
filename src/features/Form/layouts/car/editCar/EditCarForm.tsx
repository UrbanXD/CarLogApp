import React from "react";
import useEditCarForm from "./useEditCar";
import { CarTableType } from "../../../../Database/connector/powersync/AppSchema";
import EditForm from "../../../components/EditForm";

interface EditCarFormProps {
    car: CarTableType
    carImage?: string
    stepIndex: number
}
const EditCarForm: React.FC<EditCarFormProps> = ({
    car,
    carImage,
    stepIndex
}) => {
    const restProps =
        useEditCarForm(car, carImage);

    return (
        <EditForm
            stepIndex={ stepIndex }
            { ...restProps }
        />
    )
}

export default EditCarForm;