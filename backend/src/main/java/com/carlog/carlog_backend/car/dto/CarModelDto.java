package com.carlog.carlog_backend.car.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarModelDto {
    private Long id;
    private String name;
    private String year;
}
