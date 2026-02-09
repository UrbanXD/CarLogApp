import React from "react";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { CarFormFields, useCreatCarFormProps } from "../../schemas/form/carForm.ts";
import useCarSteps from "../../hooks/useCarSteps.tsx";
import { CarCreateToast } from "../../presets/toast";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast";
import { SubmitHandlerArgs } from "../../../../types";
import { UserAccount } from "../../../user/schemas/userSchema.ts";

type CreateCarFormProps = {
    user: UserAccount
    onFormStateChange?: (formState: FormState<CarFormFields>) => void
}

export function CreateCarForm({ user, onFormStateChange }: CreateCarFormProps) {
    const { carDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<CarFormFields>(useCreatCarFormProps(user.id, user.currency.id));
    const steps = useCarSteps({ form });

    const submitHandler: SubmitHandlerArgs<CarFormFields> = {
        onValid: async (formResult) => {
            try {
                await carDao.createFromFormResult(formResult);

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