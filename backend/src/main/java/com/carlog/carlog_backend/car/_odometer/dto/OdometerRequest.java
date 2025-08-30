package com.carlog.carlog_backend.car._odometer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OdometerRequest {
    private Long value;
    private OdometerMeasurementEnum measurement;
}
