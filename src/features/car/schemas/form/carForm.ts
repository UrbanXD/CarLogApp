import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, carSchema } from "../carSchema.ts";
import { modelSchema } from "../modelSchema.ts";
import { zImage, zNumber, zPickerRequiredNumber, zPickerRequiredString } from "../../../../types/zodTypes.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { currencySchema } from "../../../_shared/currency/schemas/currencySchema.ts";
import { getMediaType } from "../../../../database/utils/getFileExtension.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { DefaultValues } from "react-hook-form";
import { odometerLogSchema } from "../../_features/odometer/schemas/odometerLogSchema.ts";
import { MIN_ODOMETER_VALUE } from "../../_features/odometer/utils/zodOdometerValidation.ts";
import { useMemo } from "react";

export const carFormSchema = carSchema
.pick({ id: true, ownerId: true, name: true, createdAt: true })
.extend({
    model: z.object({
        id: zPickerRequiredString({ errorMessage: "error.car_model_picker_required" }).pipe(modelSchema.shape.id),
        name: z.string().optional(), // hidden input only for result screen
        makeId: zPickerRequiredString({ errorMessage: "error.car_make_picker_required" })
        .pipe(modelSchema.shape.makeId),
        makeName: z.string().optional(), // hidden input only for result screen
        year: zPickerRequiredString({ errorMessage: "error.car_model_year_picker_required" })
        .pipe(modelSchema.shape.startYear)
    }),
    odometer: z.object({
        id: odometerLogSchema.shape.id,
        odometerChangeLogId: z.string().uuid().nullable(),
        value: zNumber({
                bounds: { min: MIN_ODOMETER_VALUE },
                errorMessage: {
                    required: "error.odometer_value_required",
                    minBound: () => "error.odometer_value_non_negative"
                }
            }
        ).pipe(odometerLogSchema.shape.value),
        unitId: zPickerRequiredNumber({ errorMessage: "error.unit_picker_required" })
        .pipe(carSchema.shape.odometer.shape.unit.shape.id)
    }),
    currencyId: currencySchema.shape.id,
    fuelTank: carSchema.shape.fuelTank.pick({ id: true }).extend({
        typeId: zPickerRequiredNumber({ errorMessage: "error.fuel_type_picker_required" })
        .pipe(carSchema.shape.fuelTank.shape.type.shape.id),
        capacity: zNumber({ bounds: { min: 0 } }).pipe(carSchema.shape.fuelTank.shape.capacity),
        unitId: zPickerRequiredNumber({ errorMessage: "error.unit_picker_required" })
        .pipe(carSchema.shape.fuelTank.shape.unit.shape.id)
    }),
    image: zImage.optional().nullable()
});

export type CarFormFields = z.infer<typeof carFormSchema>;

export const useCreatCarFormProps = (userId: string, currencyId: number) => {
    return useMemo(() => {
        return {
            defaultValues: {
                id: getUUID(),
                ownerId: userId,
                name: "",
                image: null,
                model: {
                    id: "",
                    name: "",
                    makeId: "",
                    makeName: "",
                    year: ""
                },
                odometer: {
                    id: getUUID(),
                    odometerChangeLogId: getUUID(),
                    value: undefined,
                    unitId: undefined
                },
                currencyId: currencyId,
                fuelTank: {
                    id: getUUID(),
                    typeId: undefined,
                    unitId: undefined,
                    capacity: undefined
                },
                createdAt: new Date().toISOString()
            } as DefaultValues<CarFormFields>,
            resolver: zodResolver(carFormSchema)
        };
    }, [userId]);
};

export const useEditCarFormProps = (car: Car, attachmentQueue?: PhotoAttachmentQueue) => {
    const defaultValues: DefaultValues<CarFormFields> = {
        id: car.id,
        ownerId: car.ownerId,
        name: car.name,
        image:
            car.imagePath
            ?
                {
                    uri: attachmentQueue
                         ? attachmentQueue.getLocalUri(attachmentQueue.getLocalFilePathSuffix(car.imagePath))
                         : car.imagePath,
                    fileName: car.imagePath,
                    mediaType: getMediaType(car.imagePath)
                }
            : null,
        model: {
            id: car.model.id,
            name: car.model.name,
            makeId: car.model.make.id,
            makeName: car.model.make.name,
            year: car.model.year
        },
        odometer: {
            id: car.odometer.id,
            odometerChangeLogId: null, // not changeable by car
            value: car.odometer.value,
            unitId: car.odometer.unit.id
        },
        currencyId: car.currency.id,
        fuelTank: {
            id: car.fuelTank.id,
            typeId: car.fuelTank.type.id,
            unitId: car.fuelTank.unit.id,
            capacity: car.fuelTank.capacity
        },
        createdAt: car.createdAt
    };

    return { defaultValues, resolver: zodResolver(carFormSchema) };
};