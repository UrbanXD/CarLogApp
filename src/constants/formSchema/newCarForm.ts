import {column} from "@powersync/react-native";
import {z} from "zod";
import {getUUID} from "../../db/uuid";
import {zodResolver} from "@hookform/resolvers/zod";
import {GetFormHandleSubmitArgs} from "../constants";
import {store} from "../../redux/store";
import {addCar} from "../../redux/reducers/cars.slices";

export interface NewCarFormFieldType {
    name: string
    brand: string
    model: string
    // image: string
}

export const newCarFormSchema = z
    .object({
        name: z.string().min(10, "10 karakter legyen").max(10, "10 karakter legyen"),
        brand: z.string(),
        model: z.string(),
        // image: z.string(),
    })

export const newCarUseFormProps = {
    defaultValues: {
        name: "",
        brand: "",
        model: "",
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