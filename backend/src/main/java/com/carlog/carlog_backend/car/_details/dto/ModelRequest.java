package com.carlog.carlog_backend.car._details.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ModelRequest {
    @NotBlank(message = "MakeId is required")
    private Long makeId;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Name is required")
    private String startYear;
    private String endYear;
    private Boolean active = true;
}
