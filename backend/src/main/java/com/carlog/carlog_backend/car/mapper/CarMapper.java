package com.carlog.carlog_backend.car.mapper;

import com.carlog.carlog_backend.car._details.mapper.MakeMapper;
import com.carlog.carlog_backend.car._odometer.mapper.OdometerMapper;
import com.carlog.carlog_backend.car.dto.CarDto;
import com.carlog.carlog_backend.car.entity.Car;
import com.carlog.carlog_backend.configuration.MapstructConfig;
import com.carlog.carlog_backend.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapstructConfig.class, uses = {UserMapper.class, MakeMapper.class, OdometerMapper.class})
public interface CarMapper {
    @Mapping(target = "make", source = "model.make")
    @Mapping(target = "model.id", source = "model.id")
    @Mapping(target = "model.name", source = "model.name")
    @Mapping(target = "model.year", source = "modelYear")
    CarDto toCarDto(Car car);

    @Mapping(target = "model.make", source = "make")
    @Mapping(target = "model.id", source = "model.id")
    @Mapping(target = "model.name", source = "model.name")
    @Mapping(target = "modelYear", source = "model.year")
    @Mapping(target = "model.startYear", ignore = true)
    @Mapping(target = "model.endYear", ignore = true)
    @Mapping(target = "model.active", ignore = true)
    Car toCarEntity(CarDto dto);

    List<CarDto> toCarDtoList(List<Car> cars);
}

