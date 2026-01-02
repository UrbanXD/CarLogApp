import React from "react";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAppSelector } from "../../../../hooks/index.ts";
import { getUser } from "../../../user/model/selectors/index.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { CarFormFields, useCreatCarFormProps } from "../../schemas/form/carForm.ts";
import useCarSteps from "../../hooks/useCarSteps.tsx";
import { CarCreateToast } from "../../presets/toast/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";
import { SubmitHandlerArgs } from "../../../../types/index.ts";

type CreateCarFormProps = {
    onFormStateChange?: (formState: FormState<CarFormFields>) => void
}

export function CreateCarForm({ onFormStateChange }: CreateCarFormProps) {
    const user = useAppSelector(getUser);
    const { carDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    if(!user) throw new Error("User not found");

    const form = useForm<CarFormFields>(useCreatCarFormProps(user));
    const steps = useCarSteps(form);

    const submitHandler: SubmitHandlerArgs<CarFormFields> = {
        onValid: async (formResult) => {
            try {
                await carDao.create(formResult);

                if(dismissBottomSheet) dismissBottomSheet(true);
                openToast(CarCreateToast.success());
            } catch(e) {
                console.log("car create error: ", e);
                openToast(CarCreateToast.error());
            }
        },
        onInvalid: (e) => {
            openToast(InvalidFormToast.warning());
            console.log("car create form validation error: ", e);
        }
    };

    return (
        <MultiStepForm
            form={ form }
            steps={ steps.steps }
            resultStep={ steps.resultStep }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}