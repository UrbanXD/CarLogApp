import React from "react";
import InputText from "../../../../components/Input/InputText";
import {ICON_NAMES} from "../../../../constants/constants";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";

const RegisterStepTwo: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <InputText
                key={ 2 }
                control={ control }
                fieldName="lastname"
                fieldNameText="Vezetéknév"
                icon={ ICON_NAMES.user }
                placeholder="Kovács"
                isInBottomSheet={true}
            />
            <InputText
                key={ 3 }
                control={ control }
                fieldName="firstname"
                fieldNameText="Keresztnév"
                icon={ ICON_NAMES.user }
                placeholder="János"
                isInBottomSheet={true}
            />
        </>
    )
}

export default RegisterStepTwo;