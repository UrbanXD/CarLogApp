import { useAppDispatch } from "../../../../hooks/index.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../car/hooks/useCars.ts";
import { useForm } from "react-hook-form";
import { RideLogFormFields, useCreateRideLogFormProps } from "../../schemas/form/rideLogForm.ts";
import { useRideLogFormFields } from "../../hooks/useRideLogForm.tsx";
import { CarCreateToast } from "../../../car/presets/toast/index.ts";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { updateCarOdometer } from "../../../car/model/slice/index.ts";

export function CreateRideLogForm() {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { rideLogDao } = useDatabase();
    const { selectedCar } = useCars();

    const form = useForm<RideLogFormFields>(useCreateRideLogFormProps(selectedCar));
    const { handleSubmit } = form;

    const { multiStepFormSteps } = useRideLogFormFields(form);

    const submitHandler = handleSubmit(
        async (formResult: RideLogFormFields) => {
            try {
                const result = await rideLogDao.create(formResult);
                if(result?.odometer) dispatch(updateCarOdometer({ odometer: result.odometer }));

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create service log validation errors", errors);
            openToast(CarCreateToast.error());
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