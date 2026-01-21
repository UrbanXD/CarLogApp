import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { FormState, useForm } from "react-hook-form";
import { RideLogFormFields, useCreateRideLogFormProps } from "../../schemas/form/rideLogForm.ts";
import { useRideLogFormFields } from "../../hooks/useRideLogFormFields.tsx";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { CreateToast, InvalidFormToast } from "../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../types";
import { useCar } from "../../../car/hooks/useCar.ts";

type CreateRideLogFormProps = {
    onFormStateChange?: (formState: FormState<RideLogFormFields>) => void
}

export function CreateRideLogForm({ onFormStateChange }: CreateRideLogFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { rideLogDao } = useDatabase();
    const { car } = useCar({ options: { queryOnce: true } });

    const form = useForm<RideLogFormFields>(useCreateRideLogFormProps(car));
    const { multiStepFormSteps } = useRideLogFormFields({ form });

    const submitHandler: SubmitHandlerArgs<RideLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await rideLogDao.createFromFormResult(formResult);

                openToast(CreateToast.success(t("rides.log")));
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("rides.log")));
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Create ride log validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <MultiStepForm
            form={ form }
            steps={ multiStepFormSteps }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}