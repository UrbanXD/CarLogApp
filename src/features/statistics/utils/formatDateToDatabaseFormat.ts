import { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";

export function formatDateToDatabaseFormat(date: DateType) {
    return dayjs(date).utc().format("YYYY-MM-DD HH:mm:ss.SSS") + "Z";
}