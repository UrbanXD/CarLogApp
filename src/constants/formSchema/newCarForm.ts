import { z } from "zod";
import {getUUID} from "../../db/uuid";
import {zodResolver} from "@hookform/resolvers/zod";
import {GetFormHandleSubmitArgs} from "../constants";
import {store} from "../../redux/store";
import {addCar} from "../../redux/reducers/cars.slices";
import {PickerDataType} from "../../components/Input/InputPicker/Picker";
import {InputPickerDataType} from "../../components/Input/InputPicker/InputPicker";

export const newCarFormStepsField = [["name"], ["brand", "model"], ["odometer_value", "odometer_measurement"], ["fuel_type", "fuel_measurement", "fuel_tank_size"]];
export const newCarFormStepsTitle = ["Elnevezés", "Autó Tipus", "Model", "Autó adatok"];

export const ODOMETER_MEASUREMENTS: Array<InputPickerDataType> = [{title: "Kilóméter"}, {title: "Mérföld"}];
export const FUEL_TYPES: Array<InputPickerDataType> = [
    { title: "Dízel" },
    { title: "Benzin" },
    { title: "Elektromos" },
    { title: "LPG" },
]

export interface NewCarFormFieldType {
    name: string
    brand: string
    model: string
    odometer_measurement: string
    odometer_value: number
    fuel_type: string
    fuel_measurement: string
    fuel_tank_size: number
    // image: string
}

const zNumber = z
    .string()
    .transform((value) => (value === "" ? "" : Number(value)))
    .refine((value) => !isNaN(Number(value)), {
        message: "Expected number, received string",
    });

export const newCarFormSchema = z
    .object({
        name: z.string().min(2, "2 karakter legyen min").max(20, "20 karakter legyen max"),
        brand: z.string(),
        model: z.string(),
        odometer_measurement: z.string(),
        odometer_value: zNumber,
        fuel_type: z.string(),
        fuel_measurement: z.string(),
        fuel_tank_size: z.number().min(0),
        // image: z.string(),
    })

export const newCarUseFormProps = {
    defaultValues: {
        name: "",
        brand: "",
        model: "",
        odometer_measurement: ODOMETER_MEASUREMENTS[0].title,
        odometer_value: 0,
        fuel_type: "",
        fuel_measurement: "",
        fuel_tank_size: 0
        // image: "",
    },
    resolver: zodResolver(newCarFormSchema)
}

export const getNewCarHandleSubmit = ({ handleSubmit, supabaseConnector, db, onSubmit }: GetFormHandleSubmitArgs) =>
    handleSubmit(async (newCar: NewCarFormFieldType) => {
        console.log("handel submit new cda")
        try {
            if(!supabaseConnector || !db){
                throw Error("Hiba, supabase connector vagy DB");
            }

            const { userID } = await supabaseConnector.fetchCredentials();
            const carID = getUUID();

            const car = {
                id: carID,
                owner: userID,
                image: null,
                ...newCar
            }
            console.log("xd")
            store.dispatch(addCar({ db, car }));

            if (onSubmit) {
                onSubmit(true);
            }
        } catch (e){
            console.log(e);
            if (onSubmit) {
                onSubmit(false);
            }
        }
    })