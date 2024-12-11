import { z } from "zod";
import { getUUID } from "../../../../core/utils/database/uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetFormHandleSubmitArgs } from "../../../../core/constants/constants";
import { store } from "../../../../core/redux/store";
import { addCar } from "../../../redux/cars/cars.slices";
import { InputPickerDataType } from "../../../components/InputPicker/InputPicker";

export const newCarFormStepsField = [["name"], ["brand", "model"], ["odometer_value", "odometer_measurement"], ["fuel_type", "fuel_measurement", "fuel_tank_size"]];
export const newCarFormStepsTitle = ["Elnevezés", "Gyártó", "Autó adatok", "Autó adatok"];

export const ODOMETER_MEASUREMENTS: Array<InputPickerDataType> = [
    { title: "Kilóméter (km)", value: "km" },
    { title: "ascdvsvxfbvbbr", value: "a" },
    { title: "Mérföld (m)", value: "mile" }
];

export const FUEL_TYPES: Array<InputPickerDataType> = [
    { title: "Dízel" },
    { title: "Benzin" },
    { title: "Elektromos" },
    { title: "LPG" },
];

export const FUEL_MEASUREMENTS: Array<InputPickerDataType> = [
    { title: "Liter", value: "l" },
    { title: "Gallon", value: "gal" }
];

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
    .min(1, "Adjon meg számot")
    .transform((value) => (value === "" ? "" : Number(value)))
    .refine((value) => !isNaN(Number(value)), {
        message: "Kérem számot adjon",
    });

const zPickerRequired = z
    .string()
    .min(1, "Válasszon ki egy elemet!")

export const newCarFormSchema = z
    .object({
        name: z.string().min(2, "2 karakter legyen min").max(20, "20 karakter legyen max"),
        brand: zPickerRequired,
        model: zPickerRequired,
        odometer_measurement: zPickerRequired,
        odometer_value: zNumber,
        fuel_type: zPickerRequired,
        fuel_measurement: zPickerRequired,
        fuel_tank_size: zNumber,
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