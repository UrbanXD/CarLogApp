import {CarFormFieldType, useCarFormProps} from "../../../constants/schemas/carSchema";
import {getUUID} from "../../../../Database/utils/uuid";
import {CarTableType} from "../../../../Database/connector/powersync/AppSchema";
import {store} from "../../../../Database/redux/store";
import {addCar} from "../../../../Database/redux/cars/functions/addCar";
import {useDatabase} from "../../../../Database/connector/Database";
import {useAlert} from "../../../../Alert/context/AlertProvider";
import {useForm} from "react-hook-form";
import newCarToast from "../../../../Alert/layouts/toast/newCarToast";
import React from "react";
import NameStep from "../steps/NameStep";
import CarModelStep from "../steps/CarModelStep";
import OdometerStep from "../steps/OdometerStep";
import FuelStep from "../steps/FuelStep";
import useCarSteps from "../steps/useCarSteps";

const useNewCarForm = (
    forceCloseBottomSheet: () => void
) => {
    const database = useDatabase();
    const { addToast } = useAlert();

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        resetField
    } =
        useForm<CarFormFieldType>(useCarFormProps());

    const submitHandler =
        handleSubmit(async (newCar: CarFormFieldType) => {
            try {
                const { userID } = await database.supabaseConnector.fetchCredentials();
                let image = null;
                if(database.attachmentQueue && newCar.image) {
                    image = await database.attachmentQueue.saveFile(newCar.image, userID);
                }

                const car = {
                    ...newCar,
                    id: getUUID(),
                    owner: userID,
                    image: image ? image.filename : null,
                } as CarTableType

                await store.dispatch(addCar({ database, car }));

                //ha sikeres a hozzaadas
                reset();
                forceCloseBottomSheet();
                addToast(newCarToast.success);
            } catch (e){
                console.log(e);
                //ha sikertelen
                addToast(newCarToast.error);
            }
        })

    return {
        control,
        submitHandler,
        trigger,
        resetField,
        steps: useCarSteps(control, resetField)
    }
}

export default useNewCarForm;