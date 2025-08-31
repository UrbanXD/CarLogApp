package com.carlog.carlog_backend.car._odometer.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OdometerRequest {
    @PositiveOrZero(message = "Odometer value must be a positive number or zero")
    @NotNull(message = "Odometer value is required")
    private Long value;

    @NotNull(message = "Odometer measurement is required")
    private OdometerMeasurementEnum measurement;
}
