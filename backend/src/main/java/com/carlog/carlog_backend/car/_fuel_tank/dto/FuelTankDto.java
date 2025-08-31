package com.carlog.carlog_backend.car._fuel_tank.dto;

import com.carlog.carlog_backend.car.entity.Car;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.UUID;

@Data
public class FuelTankDto {
    private UUID id;
    @JsonIgnore
    private Car car;
    private FuelTankType type;
    private Long capacity;
    private Long value;
    private FuelTankMeasurementType measurement;
}
