package com.carlog.carlog_backend.car._odometer.mapper;

import com.carlog.carlog_backend.car._odometer.dto.OdometerDto;
import com.carlog.carlog_backend.car._odometer.entity.Odometer;
import com.carlog.carlog_backend.configuration.MapstructConfig;
import org.mapstruct.Mapper;

@Mapper(config = MapstructConfig.class)
public interface OdometerMapper {
    OdometerDto toOdometerDto(Odometer odometer);

    Odometer toOdometerEntity(OdometerDto odometerDto);
}
