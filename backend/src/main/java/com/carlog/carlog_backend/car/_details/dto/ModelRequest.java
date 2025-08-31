package com.carlog.carlog_backend.car._details.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ModelRequest {
    @NotNull(message = "MakeId is required")
    private Long makeId;

    @NotBlank(message = "Model name is required")
    private String name;

    @NotBlank(message = "Model start year is required")
    private String startYear;

    private String endYear;

    private Boolean active = true;
}
