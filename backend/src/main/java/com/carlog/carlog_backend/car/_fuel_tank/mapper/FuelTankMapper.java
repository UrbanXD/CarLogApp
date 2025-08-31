package com.carlog.carlog_backend.car._fuel_tank.mapper;

import com.carlog.carlog_backend.car._fuel_tank.dto.FuelTankDto;
import com.carlog.carlog_backend.car._fuel_tank.entity.FuelTank;
import com.carlog.carlog_backend.car.mapper.CarMapper;
import com.carlog.carlog_backend.configuration.MapstructConfig;
import org.mapstruct.Mapper;

@Mapper(config = MapstructConfig.class, uses = {CarMapper.class})
public interface FuelTankMapper {
    FuelTankDto toFuelTankDto(FuelTank fuelTank);

    FuelTank toFuelTankEntity(FuelTankDto fuelTankDto);
}
