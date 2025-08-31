package com.carlog.carlog_backend.car.dto;

import com.carlog.carlog_backend.car._fuel_tank.dto.FuelTankRequest;
import com.carlog.carlog_backend.car._odometer.dto.OdometerRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CarRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotNull(message = "ModelId is required")
    private Long modelId;
    private String modelYear;
    @Valid
    @NotNull(message = "Odometer is required")
    private OdometerRequest odometer;
    @Valid
    @NotNull(message = "FuelTank is required")
    private FuelTankRequest fuelTank;
    private String imageUrl;
}
