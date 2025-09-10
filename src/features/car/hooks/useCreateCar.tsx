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
        resetField,
        setValue,
        getValues
    } = useForm<CarFormFields>(useCreatCarFormProps(user.id));

    const steps = useCarSteps<CarFormFields>({ control, resetField, setValue, getValues });

    const submitHandler =
        handleSubmit(async (formResult: CarFormFields) => {
            try {
                await dispatch(createCar({ database, formResult }));

                reset();
                if(dismissBottomSheet) dismissBottomSheet(true);
                openToast(CarCreateToast.success());
            } catch(e) {
                console.log(e);
                openToast(CarCreateToast.error());
            }
        });

    return { control, submitHandler, trigger, resetField, steps };
};

export default useCreateCarForm;