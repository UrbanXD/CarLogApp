import { useAppDispatch } from "../../../../hooks/index.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../car/hooks/useCars.ts";
import { useForm } from "react-hook-form";
import { RideLogFormFields, useCreateRideLogFormProps } from "../../schemas/form/rideLogForm.ts";
import { useRideLogFormFields } from "../../hooks/useRideLogFormFields.tsx";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { updateCarOdometer } from "../../../car/model/slice/index.ts";
import { CreateToast, InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";

export function CreateRideLogForm() {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { rideLogDao } = useDatabase();
    const { selectedCar } = useCars();

    const form = useForm<RideLogFormFields>(useCreateRideLogFormProps(selectedCar));
    const { handleSubmit } = form;

    const { multiStepFormSteps } = useRideLogFormFields({ form });

    const submitHandler = handleSubmit(
        async (formResult: RideLogFormFields) => {
            try {
                const result = await rideLogDao.create(formResult);
                if(result?.odometer) dispatch(updateCarOdometer({ odometer: result.odometer }));

                openToast(CreateToast.success(t("rides.log")));

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("rides.log")));
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create service log validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <MultiStepForm
            steps={ multiStepFormSteps }
            submitHandler={ submitHandler }
            { ...form }
        />
    );
}