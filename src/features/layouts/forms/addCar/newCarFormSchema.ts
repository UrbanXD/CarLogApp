import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetFormHandleSubmitArgs } from "../../../core/constants/constants";
import { store } from "../../../core/redux/store";
import { addCar } from "../../../core/redux/cars/cars.slices";
import { InputPickerDataType } from "../../../core/components/input/picker/InputPicker";
import { getUUID } from "../../../core/utils/uuid";
import { ImageType } from "../../../core/utils/pickImage";
import { CarTableType } from "../../../core/utils/database/powersync/AppSchema";

export const newCarFormStepsField = [["name"], ["brand", "model"], ["odometerValue", "odometerMeasurement"], ["fuelType", "fuelMeasurement", "fuelTankSize"]];
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
    odometerMeasurement: string
    odometerValue: number
    fuelType: string
    fuelMeasurement: string
    fuelTankSize: number
    image?: ImageType | null
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

const zImage = z
    .any()
    // .refine((value) => (value))

export const newCarFormSchema = z
    .object({
        name: z.string().min(2, "2 karakter legyen min").max(20, "20 karakter legyen max"),
        brand: zPickerRequired,
        model: zPickerRequired,
        odometerMeasurement: zPickerRequired,
        odometerValue: zNumber,
        fuelType: zPickerRequired,
        fuelMeasurement: zPickerRequired,
        fuelTankSize: zNumber,
        image: z.any(),
    })

export const newCarUseFormProps = {
    defaultValues: {
        name: "",
        brand: "",
        model: "",
        odometerMeasurement: ODOMETER_MEASUREMENTS[0].title,
        odometerValue: 0,
        fuelType: "",
        fuelMeasurement: "",
        fuelTankSize: 0,
        image: null,
    },
    resolver: zodResolver(newCarFormSchema)
}

export const getNewCarHandleSubmit = ({ handleSubmit, database, onSubmit }: GetFormHandleSubmitArgs) =>
    handleSubmit(async (newCar: NewCarFormFieldType) => {
        try {
            if(!database || !database.supabaseConnector || !database.db) {
                throw Error("Hiba, supabase connector vagy DB");
            }

            const { userID } = await database.supabaseConnector.fetchCredentials();
            let image = null;
            if(database.attachmentQueue && newCar.image) {
                image = await database.attachmentQueue.saveFile(newCar.image, userID);
            }

            const car = {
                ...newCar,
                id: getUUID(),
                owner: userID,
                image: image ? image.filename : null,
            } as CarTableType

            await store.dispatch(addCar({ database, car }));

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