package com.carlog.carlog_backend.car._details.mapper;

import com.carlog.carlog_backend._configuration.MapstructConfig;
import com.carlog.carlog_backend.car._details.dto.MakeDto;
import com.carlog.carlog_backend.car._details.entity.Make;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapstructConfig.class)
public interface MakeMapper {
    MakeDto toMakeDto(Make make);

    List<MakeDto> toMakeDtoList(List<Make> makes);

    Make toMakeEntity(MakeDto makeDto);
}
