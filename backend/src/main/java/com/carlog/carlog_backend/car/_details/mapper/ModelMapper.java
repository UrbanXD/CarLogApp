package com.carlog.carlog_backend.car._details.mapper;

import com.carlog.carlog_backend._configuration.MapstructConfig;
import com.carlog.carlog_backend.car._details.dto.ModelDto;
import com.carlog.carlog_backend.car._details.entity.Model;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapstructConfig.class, uses = {MakeMapper.class})
public interface ModelMapper {
    ModelDto toModelDto(Model model);

    List<ModelDto> toModelDtoList(List<Model> models);
}
