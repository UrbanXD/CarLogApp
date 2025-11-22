import { useForm } from "react-hook-form";
import useCarSteps from "./useCarSteps.tsx";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { createCar } from "../model/actions/createCar.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { CarCreateToast } from "../presets/toast/index.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useAppDispatch, useAppSelector } from "../../../hooks/index.ts";
import { CarFormFields, useCreatCarFormProps } from "../schemas/form/carForm.ts";
import { getUser } from "../../user/model/selectors/index.ts";
import { InvalidFormToast } from "../../../ui/alert/presets/toast/index.ts";

const useCreateCarForm = () => {
    const database = useDatabase();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    if(!user) throw new Error("User not found");

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        formState,
        resetField,
        setValue,
        getValues
    } = useForm<CarFormFields>(useCreatCarFormProps(user));

    const steps = useCarSteps<CarFormFields>({ control, formState, setValue, getValues });

    const submitHandler =
        handleSubmit(async (formResult: CarFormFields) => {
            try {
                await dispatch(createCar({ database, formResult }));

                reset();
                if(dismissBottomSheet) dismissBottomSheet(true);
                openToast(CarCreateToast.success());
            } catch(e) {
                console.log("car create error: ", e);
                openToast(CarCreateToast.error());
            }
        }, (e) => {
            openToast(InvalidFormToast.warning());
            console.log("car create form validation error: ", e);
        });

    return { control, submitHandler, trigger, resetField, steps };
};

export default useCreateCarForm;