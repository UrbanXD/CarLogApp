import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, carSchema } from "../carSchema.ts";
import { modelSchema } from "../modelSchema.ts";
import { zImage, zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { currencySchema } from "../../../_shared/currency/schemas/currencySchema.ts";
import { odometerChangeLogForm } from "../../_features/odometer/schemas/form/odometerChangeLogForm.ts";
import { UserAccount } from "../../../user/schemas/userSchema.ts";
import { getMediaType } from "../../../../database/utils/getFileExtension.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";

export const carFormSchema = carSchema
.pick({ id: true, ownerId: true, name: true })
.extend({
    model: z.object({
        id: zPickerRequired("error.car_model_picker_required").pipe(modelSchema.shape.id),
        name: z.string().optional(), // hidden input only for result screen
        makeId: zPickerRequired("error.car_make_picker_required").pipe(modelSchema.shape.makeId),
        makeName: z.string().optional(), // hidden input only for result screen
        year: zPickerRequired("error.car_model_year_picker_required").pipe(modelSchema.shape.startYear)
    }),
    odometer: odometerChangeLogForm()
    .pick({ id: true, value: true })
    .extend({
        odometerChangeLogId: odometerChangeLogForm().shape.odometerChangeLogId.nullable(),
        unitId: zPickerRequired("error.unit_picker_required")
        .pipe(carSchema.shape.odometer.shape.unit.shape.id)
    }),
    currencyId: currencySchema.shape.id,
    fuelTank: carSchema.shape.fuelTank.pick({ id: true }).extend({
        typeId: zPickerRequired("error.fuel_type_picker_required")
        .pipe(carSchema.shape.fuelTank.shape.type.shape.id),
        capacity: zNumber({ bounds: { min: 0 } }).pipe(carSchema.shape.fuelTank.shape.capacity),
        unitId: zPickerRequired("error.unit_picker_required")
        .pipe(carSchema.shape.fuelTank.shape.unit.shape.id)
    }),
    image: zImage.optional().nullable()
});

export type CarFormFields = z.infer<typeof carFormSchema>;

export const useCreatCarFormProps = (user: UserAccount) => {
    const defaultValues: CarFormFields = {
        id: getUUID(),
        ownerId: user.id,
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
            value: null,
            unitId: ""
        },
        currencyId: user.currency.id,
        fuelTank: {
            id: getUUID(),
            typeId: "",
            unitId: "",
            capacity: null
        }
    };

    return { defaultValues, resolver: zodResolver(carFormSchema) };
};

export const useEditCarFormProps = (car: Car, attachmentQueue?: PhotoAttachmentQueue) => {
    const defaultValues: CarFormFields = {
        id: car.id,
        ownerId: car.ownerId,
        name: car.name,
        image: {
            uri: attachmentQueue
                 ? attachmentQueue.getLocalUri(attachmentQueue.getLocalFilePathSuffix(car.imagePath))
                 : car.imagePath,
            fileName: car.imagePath,
            mediaType: getMediaType(car.imagePath)
        },
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
        }
    };

    return { defaultValues, resolver: zodResolver(carFormSchema) };
};