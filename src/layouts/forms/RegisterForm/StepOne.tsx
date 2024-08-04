import React from "react";
import InputText from "../../../components/Form/InputText";
import {ICON_NAMES} from "../../../constants/constants";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";

const RegisterStepOne: React.FC = () => {
    const { control } = useMultiStepForm();

    return (
        <InputText
            key={ 1 }
            control={ control }
            fieldName="email"
            fieldNameText="Email cím"
            icon={ ICON_NAMES.email }
            placeholder="carlog@gmail.com"
        />
    )
}

export default RegisterStepOne;