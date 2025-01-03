import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDatabase } from "../../../../Database/connector/Database";
import {
    CARS,
    DATA_TRANSFORM_TO_PICKER_DATA,
    ICON_NAMES,
} from "../../../../Shared/constants/constants";
import { useMultiStepForm } from "../../../context/MultiStepFormProvider";
import MultiStepForm from "../../../components/MultiStepForm/MultiStepForm";
import Input from "../../../components/Input/Input";
import { InputPickerDataType } from "../../../components/Input/picker/InputPicker";
import {useAlert} from "../../../../Alert/context/AlertProvider";
import newCarToast from "../../../../Alert/layouts/toast/newCarToast";
import {
    CAR_FORM_STEPS_FIELD,
    CAR_FORM_STEPS_TITLE,
    CarFormFieldType,
    useCarFormProps
} from "../../../constants/schemas/carSchema";
import useNewCarForm from "./useNewCar";

interface NewCarFormProps {
    forceCloseBottomSheet: () => void
}
const NewCarForm: React.FC<NewCarFormProps> = ({
    forceCloseBottomSheet
}) => {
    const {
        control,
        submitHandler,
        trigger,
        resetField,
        steps
    } = useNewCarForm(forceCloseBottomSheet);

    return (
        <MultiStepForm
            steps={ steps }
            stepsTitle={ CAR_FORM_STEPS_TITLE }
            fieldsName={ CAR_FORM_STEPS_FIELD }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    )
}

export default NewCarForm;