import { OdometerLogDao } from "../model/dao/OdometerLogDao.ts";
import { RefinementCtx, z } from "zod";
import dayjs from "dayjs";

export const MIN_ODOMETER_VALUE = 0;

type ZodOdometerValidationArgs = {
    ctx: RefinementCtx
    odometerLogDao: OdometerLogDao
    odometerValueFieldName: string
    carId: string
    date: string
    odometerValue?: number | null
    skipOdometerLogs?: Array<string>
}

export async function zodOdometerValidation({
    ctx,
    odometerLogDao,
    odometerValueFieldName,
    carId,
    date,
    odometerValue,
    skipOdometerLogs
}: ZodOdometerValidationArgs) {
    if(!odometerValue) return;

    const odometerLimit = await odometerLogDao.getOdometerLimitByDate(carId, date, skipOdometerLogs);

    const minOdometerValue = odometerLimit.min?.value ?? MIN_ODOMETER_VALUE;
    if(odometerValue < minOdometerValue) {
        const message =
            odometerLimit.min?.date && dayjs(odometerLimit.min.date).isValid()
            ? `error.odometer_value_min_limit;${ minOdometerValue };${ odometerLimit.unitText };${ dayjs(odometerLimit.min.date)
            .format("L") }`
            : `error.odometer_value_min_limit_without_date;${ minOdometerValue };${ odometerLimit.unitText }`;

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message,
            path: [odometerValueFieldName]
        });
    }

    if(odometerLimit.max !== null && odometerValue > odometerLimit.max.value) {
        const message =
            dayjs(odometerLimit.max.date).isValid()
            ? `error.odometer_value_max_limit;${ odometerLimit.max.value };${ odometerLimit.unitText };${ dayjs(
                odometerLimit.max.date)
            .format("L") }`
            : `error.odometer_value_max_limit_without_date;${ odometerLimit.max.value };${ odometerLimit.unitText }`;

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message,
            path: [odometerValueFieldName]
        });
    }
}