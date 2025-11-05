c;
export const rideLogTable = new Table({
    id: column.text,
    car_id: column.text,
    expense_id: column.text,
    start_odometer_log_id: column.text,
    end_odometer_log_id: column.text,
    start_time: column.text,
    end_time: column.text
});