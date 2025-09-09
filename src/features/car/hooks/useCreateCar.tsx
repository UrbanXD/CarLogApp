import { useForm } from "react-hook-form";
import useCarSteps from "./useCarSteps.tsx";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { createCar } from "../model/actions/createCar.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { CarCreateToast } from "../presets/toast/index.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useAppDispatch, useAppSelector } from "../../../hooks/index.ts";
import { CreateCarRequest, useCreatCarFormProps } from "../schemas/form/createCarRequest.ts";
import { getUser } from "../../user/model/selectors/index.ts";

const useCreateCarForm = () => {
    const database = useDatabase();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        resetField,
        getValues
    } = useForm<CreateCarRequest>(useCreatCarFormProps());

    const submitHandler =
        handleSubmit(async (request: CreateCarRequest) => {
            try {
                if(!user) throw new Error("User not found");

                await dispatch(createCar({ database, request: { ...request, ownerId: user.id } }));

                reset();
                if(dismissBottomSheet) dismissBottomSheet(true);
                openToast(CarCreateToast.success());
            } catch(e) {
                console.log(e);
                openToast(CarCreateToast.error());
            }
        });

    return {
        control,
        submitHandler,
        trigger,
        resetField,
        steps: useCarSteps(control, resetField, getValues)
    };
};

export default useCreateCarForm;