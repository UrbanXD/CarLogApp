package com.carlog.carlog_backend.car.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CarRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "ModelId is required")
    private Long modelId;
    private String modelYear;
    private String imageUrl;
}
