package com.carlog.carlog_backend.car._odometer.dto;

import com.carlog.carlog_backend.car.entity.Car;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.UUID;

@Data
public class OdometerDto {
    private UUID id;
    @JsonIgnore
    private Car car;
    private Long value;
    private OdometerMeasurementEnum measurement;
}
