package com.carlog.carlog_backend.car._details.service;

import com.carlog.carlog_backend._exception_handler.exceptions.NotFoundException;
import com.carlog.carlog_backend.car._details.dto.MakeDto;
import com.carlog.carlog_backend.car._details.dto.MakeRequest;
import com.carlog.carlog_backend.car._details.entity.Make;
import com.carlog.carlog_backend.car._details.mapper.MakeMapper;
import com.carlog.carlog_backend.car._details.repository.MakeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MakeService {
    private final MakeRepository makeRepository;
    private final MakeMapper makeMapper;
    private final RestClient.Builder restClientBuilder;

    @Transactional(readOnly = true)
    public List<MakeDto> getAllMake() {
        return makeMapper.toMakeDtoList(makeRepository.findAll());
    }

    @Transactional(readOnly = true)
    public MakeDto getMakeById(Long id) {
        Make make = makeRepository.findById(id).orElseThrow(() -> new NotFoundException("Make not found"));
        return makeMapper.toMakeDto(make);
    }

    public void triggerMakeScraping() {
        RestClient client = restClientBuilder
                .baseUrl("http://localhost:9001/startMakeScraping")
                .build();

        client.post().retrieve().toBodilessEntity();
    }

    @Transactional
    public MakeDto createMake(MakeRequest request) {
        Make make = new Make();
        make.setName(request.getName());
        make.setActive(true);

        Make savedMake = makeRepository.save(make);
        return makeMapper.toMakeDto(savedMake);
    }

    @Transactional
    public MakeDto upsertMake(MakeRequest request) {
        Make make = makeRepository.findByName(request.getName()).orElse(null);
        if (make == null) return createMake(request);

        make.setActive(request.getActive());

        Make savedMake = makeRepository.save(make);
        return makeMapper.toMakeDto(savedMake);
    }

    @Transactional
    public MakeDto updateMake(Long id, MakeRequest request) {
        Make make = makeRepository.findById(id).orElseThrow(() -> new NotFoundException("Make not found"));

        if (request.getName() != null) make.setName(request.getName());
        if (request.getActive() != null) make.setActive(request.getActive());

        Make savedMake = makeRepository.save(make);
        return makeMapper.toMakeDto(savedMake);
    }

    @Transactional
    public void deactivateAllMake() {
        makeRepository.deactivateAllMake();
    }

    @Transactional
    public void deleteMake(Long id) {
        if (!makeRepository.existsById(id)) throw new NotFoundException("Make not found");

        makeRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllMake() {
        makeRepository.deleteAll();
    }
}