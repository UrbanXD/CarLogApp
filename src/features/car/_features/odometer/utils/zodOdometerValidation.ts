import { OdometerLogDao } from "../model/dao/OdometerLogDao.ts";
import { RefinementCtx, z } from "zod";
import dayjs from "dayjs";

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

    if(odometerValue < odometerLimit.min.value) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `error.odometer_value_min_limit;${ odometerLimit.min.value };${ odometerLimit.unitText };${ dayjs(
                odometerLimit.min.date).format("L") }`,
            path: [odometerValueFieldName]
        });
    }

    if(odometerLimit.max !== null && odometerValue > odometerLimit.max.value) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `error.odometer_value_max_limit;${ odometerLimit.max.value };${ odometerLimit.unitText };${ dayjs(
                odometerLimit.max.date).format("L") }`,
            path: [odometerValueFieldName]
        });
    }
}