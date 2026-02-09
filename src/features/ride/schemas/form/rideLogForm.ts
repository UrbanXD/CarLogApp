import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RideLog, rideLogSchema } from "../rideLogSchema.ts";
import { odometerSchema } from "../../../car/_features/odometer/schemas/odometerSchema.ts";
import { zDate, zNumber, zPickerRequiredString } from "../../../../types/zodTypes.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { ridePlaceForm } from "../../_features/place/schemas/form/ridePlaceForm.ts";
import { ridePassengerForm } from "../../_features/passenger/schemas/form/ridePassengerForm.ts";
import { zodOdometerValidation } from "../../../car/_features/odometer/utils/zodOdometerValidation.ts";
import { OdometerLogDao } from "../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import dayjs from "dayjs";
import { transformedRideExpenseForm } from "../../_features/rideExpense/schemas/form/rideExpenseForm.ts";
import { DefaultValues, UseFormProps } from "react-hook-form";

const rideLogForm = (odometerLogDao: OdometerLogDao) => rideLogSchema
.pick({ id: true, note: true })
.extend({
    carId: zPickerRequiredString().pipe(rideLogSchema.shape.car.shape.id),
    startTime: zDate().pipe(rideLogSchema.shape.startTime),
    endTime: zDate().pipe(rideLogSchema.shape.endTime),
    startOdometerLogId: odometerSchema.shape.id, // hidden
    startOdometerValue: zNumber({
        bounds: { min: 0 },
        errorMessage: {
            required: "error.odometer_value_required",
            minBound: () => "error.odometer_value_non_negative"
        }
    }),
    endOdometerLogId: odometerSchema.shape.id, // hidden
    endOdometerValue: zNumber({
        bounds: { min: 0 },
        errorMessage: {
            required: "error.odometer_value_required",
            minBound: () => "error.odometer_value_non_negative"
        }
    }),
    expenses: z.array(transformedRideExpenseForm),
    places: z.array(ridePlaceForm),
    passengers: z.array(ridePassengerForm)
})
.superRefine(async (data, ctx) => {
    if(data.endTime && data.startTime && data.endTime < data.startTime) {
        ctx.addIssue({
            code: "custom",
            path: ["endTime"],
            message: "error.ride_end_time_must_be_later_than_start_time"
        });
    }

    if(data.startOdometerValue && data.endOdometerValue && data.endOdometerValue <= data.startOdometerValue) {
        ctx.addIssue({
            code: "custom",
            path: ["endOdometerValue"],
            message: "error.ride_odometer_end_must_be_bigger_than_start_odometer"
        });
    }

    await zodOdometerValidation({
        ctx,
        odometerLogDao,
        odometerValueFieldName: "startOdometerValue",
        carId: data.carId,
        date: data.startTime,
        odometerValue: data.startOdometerValue,
        skipOdometerLogs: [data.startOdometerLogId, data.endOdometerLogId]
    });

    await zodOdometerValidation({
        ctx,
        odometerLogDao,
        odometerValueFieldName: "endOdometerValue",
        carId: data.carId,
        date: data.endTime,
        odometerValue: data.endOdometerValue,
        skipOdometerLogs: [data.startOdometerLogId, data.endOdometerLogId]
    });
});

export type RideLogFormFields = z.infer<ReturnType<typeof rideLogForm>>;

export function useCreateRideLogFormProps(car: Car | null): UseFormProps<RideLogFormFields> {
    const { odometerLogDao } = useDatabase();

    const now = new Date().toISOString();
    const defaultValues: DefaultValues<RideLogFormFields> = {
        id: getUUID(),
        carId: car?.id,
        startOdometerLogId: getUUID(),
        startOdometerValue: car?.odometer.value,
        endOdometerLogId: getUUID(),
        endOdometerValue: car?.odometer.value,
        expenses: [],
        places: [],
        passengers: [],
        startTime: now,
        endTime: now,
        note: null
    };

    return { defaultValues, resolver: zodResolver(rideLogForm(odometerLogDao)) };
}

export function useEditRideLogFormProps(rideLog: RideLog): UseFormProps<RideLogFormFields> {
    const { odometerLogDao } = useDatabase();

    const defaultValues: DefaultValues<RideLogFormFields> = {
        id: rideLog.id,
        carId: rideLog.car.id,
        startOdometerLogId: rideLog.startOdometer.id,
        startOdometerValue: rideLog.startOdometer.value,
        endOdometerLogId: rideLog.endOdometer.id,
        endOdometerValue: rideLog.endOdometer.value,
        expenses: rideLog.rideExpenses,
        places: rideLog.ridePlaces,
        passengers: rideLog.ridePassengers,
        startTime: dayjs(rideLog.startTime).isValid() ? rideLog.startTime : new Date().toISOString(),
        endTime: dayjs(rideLog.endTime).isValid() ? rideLog.endTime : new Date().toISOString(),
        note: rideLog.note
    };

    return { defaultValues, resolver: zodResolver(rideLogForm(odometerLogDao)) };
}