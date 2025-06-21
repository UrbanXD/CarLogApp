import { z } from "zod";
import { getToday } from "../../../utils/getDate.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export interface EditRideFormFieldType {
    carUID: string; //hidden
    carOwnerUID: string; //hidden
    date: Date;
    time: string;
    client: string;
    passengerCount: number;
    comment: string;
    locations: Array<{
        city: string,
        place?: string
    }>;
}

const locationSchema = z
.object({
    city: z.string(),
    place: z.string().optional()
});

export const editRideFormSchema = z
.object({
    carUID: z.string(),
    carOwnerUID: z.string(),
    date: z.date(), //getToday(),
    time: z.string(), //letesztelni, hogy 00:00 formatumra vagy a 0:0-ra igazodjon
    client: z.string(),
    passengerCount: z.string().min(1),
    comment: z.string(),
    locations: z.array(locationSchema)
});

export const editRideUseFormProps = {
    defaultValues: {
        carUID: "",
        carOwnerUID: "",
        date: getToday(),
        time: "00:00",
        client: "",
        passengerCount: 1,
        locations: [],
        comment: ""
    },
    resolver: zodResolver(editRideFormSchema)
};