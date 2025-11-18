import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../userSchema.ts";
import { currencySchema } from "../../../_shared/currency/schemas/currencySchema.ts";

const editUserInformation = userSchema
.pick({
    firstname: true,
    lastname: true
})
.extend({
    currency_id: currencySchema.shape.id
});
export type EditUserInformationRequest = z.infer<typeof editUserInformation>;

export const useEditUserInformationFormProps = (defaultValues: EditUserInformationRequest) => ({
    defaultValues,
    resolver: zodResolver(editUserInformation)
});