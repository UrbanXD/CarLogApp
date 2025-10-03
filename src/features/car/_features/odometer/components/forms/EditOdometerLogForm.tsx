import React from "react";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm } from "react-hook-form";
import { OdometerLogFields, useEditOdometerLogFormProps } from "../../schemas/form/odometerLogForm.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import Input from "../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import InputDatePicker from "../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { View } from "react-native";
import { CarCreateToast } from "../../../../presets/toast/index.ts";
import { OdometerUnitText } from "../UnitText.tsx";
import Button from "../../../../../../components/Button/Button.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { convertOdometerValueFromKilometer } from "../../utils/convertOdometerUnit.ts";

export type EditOdometerLogFormProps = {
    odometerLog: OdometerLog
}

export function EditOdometerLogForm({
    odometerLog
}: EditOdometerLogFormProps) {
    const dispatch = useAppDispatch();
    const { odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const { control, handleSubmit, resetField } =
        useForm<OdometerLogFields>(useEditOdometerLogFormProps(odometerLog));

    const submitHandler = handleSubmit(
        async (formResult: OdometerLogFields) => {
            try {
                const result = await odometerLogDao.update(formResult);
                const newHighestOdometerValue = await odometerLogDao.getOdometerValueInKmByCarId(result.carId);

                dispatch(updateCarOdometer({
                    carId: result.carId,
                    value: convertOdometerValueFromKilometer(newHighestOdometerValue, result.unit.conversionFactor)
                }));

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create odometer log validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <>
            <Form containerStyle={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Input.Field
                    control={ control }
                    fieldName="value"
                    fieldNameText="Kilóméteróra állás"
                    fieldInfoText={ `Bejegyzés eredeti kilométeróra-állása: ${ odometerLog.value } ${ odometerLog.unit.short }` }
                >
                    <Input.Row style={ { gap: 0 } }>
                        <View style={ { flex: 1 } }>
                            <Input.Text
                                icon={ ICON_NAMES.odometer }
                                placeholder="100000"
                                numeric
                                type={ "secondary" }
                            />
                        </View>
                        <OdometerUnitText
                            text={ odometerLog.unit.short }
                            style={ { padding: SEPARATOR_SIZES.lightSmall } }
                        />
                    </Input.Row>
                </Input.Field>
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText="Dátum"
                >
                    <InputDatePicker/>
                </Input.Field>
                <Input.Field
                    control={ control }
                    fieldName="note"
                    fieldNameText="Megjegyzés"
                    optional
                >
                    <Input.Text
                        icon={ ICON_NAMES.note }
                        placeholder="Megjegyzés"
                        multiline
                        actionIcon={ ICON_NAMES.close }
                        onAction={ () => resetField("note") }
                    />
                </Input.Field>
            </Form>
            <Button.Text
                text={ "Mentés" }
                onPress={ submitHandler }
                style={ { width: "70%", alignSelf: "flex-end" } }
            />
        </>
    );
}