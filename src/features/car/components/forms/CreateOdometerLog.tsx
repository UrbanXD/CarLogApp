import React, { useEffect, useState } from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm, useWatch } from "react-hook-form";
import { OdometerLogFields, useCreateOdometerLogFormProps } from "../../schemas/form/odometerLogForm.ts";
import { Car } from "../../schemas/carSchema.ts";
import Form from "../../../../components/Form/Form.tsx";
import useCars from "../../hooks/useCars.ts";
import Input from "../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../constants/index.ts";
import { generatePickerItems } from "../../../../utils/toPickerItems.ts";
import { ODOMETER_MEASUREMENTS } from "../../constants/index.ts";
import InputDatePicker from "../../../../components/Input/datePicker/InputDatePicker.tsx";
import { Button } from "react-native";
import { CarCreateToast } from "../../presets/toast/index.ts";

export function CreateOdometerLogForm() {
    const { odometerDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { cars, selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(selectedCar);

    const { control, handleSubmit, clearErrors } = useForm<OdometerLogFields>(useCreateOdometerLogFormProps(car));
    const formCarId = useWatch({ control, name: "car_id" });

    useEffect(() => {
        setCar(getCar(formCarId));
        clearErrors();
    }, [formCarId]);

    const submitHandler = handleSubmit(
        async (formResult: OdometerLogFields) => {
            try {
                const odometerLogRow = odometerDao.logMapper.fromFormResultToOdometerLogEntity(formResult);
                await odometerDao.createOdometerLog(odometerLogRow);

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create odometer log validation errors", errors);
        }
    );

    return (
        <Form>
            <Input.Field
                control={ control }
                fieldName="car_id"
                fieldNameText="Autó"
            >
                <Input.Picker.Dropdown<Car>
                    data={ cars }
                    icon={ ICON_NAMES.car }
                    dataTransformSelectors={ {
                        title: "name",
                        value: "id"
                    } }
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="note"
                fieldNameText="Megjegyzés"
                optional
            >
                <Input.Text icon={ ICON_NAMES.nametag } placeholder="Note" multiline/>
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="value"
                fieldNameText="Kilóméteróra állás"
                fieldInfoText={ car && `A jelenlegi kilométeróra állás: ${ car.odometer.value } ${ car.odometer.measurement }` }
            >
                <Input.Text
                    icon={ ICON_NAMES.odometer }
                    placeholder="100000"
                    numeric
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="unit"
                fieldNameText="Mértékegység"
            >
                <Input.Picker.Simple items={ generatePickerItems(ODOMETER_MEASUREMENTS) }/>
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="date"
                fieldNameText="Dátum"
            >
                <InputDatePicker/>
            </Input.Field>
            <Button title={ "feaef" } onPress={ submitHandler }/>
        </Form>
    );
}