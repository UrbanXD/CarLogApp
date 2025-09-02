package com.carlog.carlog_backend.car._details.service;

import com.carlog.carlog_backend._exception_handler.exceptions.NotFoundException;
import com.carlog.carlog_backend.car._details.dto.MakeDto;
import com.carlog.carlog_backend.car._details.dto.ModelDto;
import com.carlog.carlog_backend.car._details.dto.ModelRequest;
import com.carlog.carlog_backend.car._details.entity.Make;
import com.carlog.carlog_backend.car._details.entity.Model;
import com.carlog.carlog_backend.car._details.mapper.MakeMapper;
import com.carlog.carlog_backend.car._details.mapper.ModelMapper;
import com.carlog.carlog_backend.car._details.repository.MakeRepository;
import com.carlog.carlog_backend.car._details.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ModelService {
    private final ModelRepository modelRepository;
    private final ModelMapper modelMapper;
    private final MakeService makeService;
    private final MakeMapper makeMapper;
    private final RestClient.Builder restClientBuilder;
    private final MakeRepository makeRepository;

    @Transactional(readOnly = true)
    public List<ModelDto> getAllModel() {
        return modelMapper.toModelDtoList(modelRepository.findAll());
    }

    @Transactional(readOnly = true)
    public ModelDto getModelById(Long id) {
        Model model = modelRepository.findById(id).orElseThrow(() -> new NotFoundException("Model not found"));
        return modelMapper.toModelDto(model);
    }

    @Transactional(readOnly = true)
    public List<ModelDto> getAllModelByMake(Long makeId) {
        return modelMapper.toModelDtoList(modelRepository.findAllByMakeId(makeId));
    }

    @Transactional(readOnly = true)
    public boolean isBelongsToMake(Long makeId, Long modelId) {
        Model model = modelRepository.findById(makeId).orElse(null);
        if (model == null) return false;

        return model.getMake().getId().equals(modelId);
    }

    public void triggerModelScraping(Long makeId) {
        Make make = makeRepository.findById(makeId).orElseThrow(() -> new NotFoundException("Make not found"));

        RestClient client = restClientBuilder
                .baseUrl("http://localhost:9001/startModelScraping/" + makeId)
                .build();

        Map<String, Object> body = new HashMap<>();
        body.put("makeName", make.getName());

        client
                .post()
                .body(body)
                .retrieve()
                .onStatus(
                        (httpStatusCode -> httpStatusCode.value() == HttpStatus.NO_CONTENT.value()), // 204
                        (_req, _res) -> makeService.deleteMake(makeId)
                )
                .toBodilessEntity();
    }

    @Transactional
    public ModelDto createModel(ModelRequest request) {
        Make make = makeMapper.toMakeEntity(makeService.getMakeById(request.getMakeId()));

        Model model = new Model();
        model.setMake(make);
        model.setName(request.getName());
        model.setStartYear(request.getStartYear());
        model.setEndYear(request.getEndYear());
        model.setActive(request.getActive() != null ? request.getActive() : true);

        return modelMapper.toModelDto(modelRepository.save(model));
    }

    @Transactional
    public ModelDto upsertModel(ModelRequest request) {
        Model model = modelRepository.findByMakeIdAndName(request.getMakeId(), request.getName()).orElse(null);

        if (model == null) return createModel(request);

        model.setName(request.getName());
        model.setStartYear(request.getStartYear());
        model.setEndYear(request.getEndYear());
        model.setActive(request.getActive());

        Model savedModel = modelRepository.save(model);
        return modelMapper.toModelDto(savedModel);
    }

    @Transactional
    public ModelDto updateModel(Long id, ModelRequest request) {
        Model model = modelRepository.findById(id).orElseThrow(() -> new NotFoundException("Model not found"));

        if (request.getMakeId() != null) {
            MakeDto makeDto = makeService.getMakeById(request.getMakeId());
            Make make = makeMapper.toMakeEntity(makeDto);

            model.setMake(make);
        }

        if (request.getName() != null) model.setName(request.getName());
        if (request.getActive() != null) model.setActive(request.getActive());

        Model savedModel = modelRepository.save(model);
        return modelMapper.toModelDto(savedModel);
    }

    @Transactional
    public void deactivateAllModel() {
        modelRepository.deactivateAllModel();
    }

    @Transactional
    public void deleteModel(Long id) {
        if (!modelRepository.existsById(id)) throw new NotFoundException("Model not found");

        modelRepository.deleteById(id);
    }
}
