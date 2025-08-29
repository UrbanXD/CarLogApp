package com.carlog.carlog_backend.car._details.controller;

import com.carlog.carlog_backend.car._details.dto.ModelDto;
import com.carlog.carlog_backend.car._details.dto.ModelRequest;
import com.carlog.carlog_backend.car._details.service.ModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/car/model")
public class ModelController {
    private final ModelService modelService;

    @GetMapping
    public ResponseEntity<List<ModelDto>> getModels() {
        List<ModelDto> models = modelService.getAllModel();

        return ResponseEntity.ok(models);
    }

    @GetMapping("/byMake/{id}")
    public ResponseEntity<List<ModelDto>> getMakeModels(@PathVariable("id") Long makeId) {
        List<ModelDto> models = modelService.getAllModelByMake(makeId);

        return ResponseEntity.ok(models);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModelDto> getModel(@PathVariable Long id) {
        return ResponseEntity.ok(modelService.getModelById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<ModelDto> addModel(@RequestBody ModelRequest request) {
        ModelDto createdModel = modelService.createModel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdModel);
    }

    @PostMapping("/upsert")
    public ResponseEntity<ModelDto> upsertModel(@RequestBody ModelRequest request) {
        ModelDto model = modelService.upsertModel(request);
        return ResponseEntity.ok(model);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ModelDto> updateModel(@PathVariable Long id, @RequestBody ModelRequest request) {
        return ResponseEntity.ok(modelService.updateModel(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteModel(@PathVariable Long id) {
        modelService.deleteModel(id);
        return ResponseEntity.ok().build();
    }
}
