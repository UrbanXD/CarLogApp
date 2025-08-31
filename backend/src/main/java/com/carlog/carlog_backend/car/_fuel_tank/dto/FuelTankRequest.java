package com.carlog.carlog_backend.car._fuel_tank.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FuelTankRequest {
    @NotNull(message = "Fuel tank type is required")
    private FuelTankType type;

    @Positive(message = "Fuel tank capacity must be a positive number")
    @NotNull(message = "Fuel tank capacity is required")
    private Long capacity;

    @PositiveOrZero(message = "Fuel tank value must be a positive number or zero")
    @NotNull(message = "Fuel tank value is required")
    private Long value;

    @NotNull(message = "Fuel tank measurement is required")
    private FuelTankMeasurementType measurement;
}
