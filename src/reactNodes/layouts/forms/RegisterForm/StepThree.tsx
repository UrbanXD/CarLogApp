import React from "react";
import InputText from "../../../../components/Input/InputText";
import {ICON_NAMES} from "../../../../constants/constants";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";

const RegisterStepThree: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <InputText
                key={ 4 }
                control={ control }
                fieldName="password"
                fieldNameText="Jelszó"
                icon={ ICON_NAMES.password }
                placeholder={"*****"}
                isSecure={ true }
                isInBottomSheet={true}

            />
            <InputText
                key={ 5 }
                control={ control }
                fieldName="rpassword"
                fieldNameText="Jelszó újra"
                icon={ ICON_NAMES.password }
                placeholder="*****"
                isSecure={ true }
                isInBottomSheet={true}

            />
        </>
    )
}

export default RegisterStepThree;