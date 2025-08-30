package com.carlog.carlog_backend.car.dto;

import com.carlog.carlog_backend.car._details.dto.MakeDto;
import com.carlog.carlog_backend.car._odometer.dto.OdometerDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDto {
    private UUID id;
    @JsonIgnore
    private UUID ownerId;
    private String name;
    private MakeDto make;
    private CarModelDto model;
    //    private FuelTankDto fuelTank;
    private OdometerDto odometer;
    private String imageUrl;
    private Instant createdAt;
}
