package com.carlog.carlog_backend.car.details.mapper;

import com.carlog.carlog_backend.car.details.dto.ModelDto;
import com.carlog.carlog_backend.car.details.entity.Model;
import com.carlog.carlog_backend.configuration.MapstructConfig;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapstructConfig.class, uses = {MakeMapper.class})
public interface ModelMapper {
    ModelDto toModelDto(Model model);

    List<ModelDto> toModelDtoList(List<Model> models);
}
