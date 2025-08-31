package com.carlog.carlog_backend.car._details.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MakeRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private Boolean active = true;
}
