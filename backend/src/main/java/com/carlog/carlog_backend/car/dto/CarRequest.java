package com.carlog.carlog_backend.car.dto;

import com.carlog.carlog_backend.car._odometer.dto.OdometerMeasurementEnum;
import com.carlog.carlog_backend.car._odometer.dto.OdometerRequest;
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
    private OdometerRequest odometer = new OdometerRequest(0L, OdometerMeasurementEnum.km);
    //    private FuelTankRequest fuelTank
    private String imageUrl;
}
