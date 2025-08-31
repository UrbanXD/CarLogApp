package com.carlog.carlog_backend.car._details.controller;

import com.carlog.carlog_backend.car._details.dto.MakeDto;
import com.carlog.carlog_backend.car._details.dto.MakeRequest;
import com.carlog.carlog_backend.car._details.service.MakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/car/make")
public class MakeController {
    private final MakeService makeService;

    @GetMapping
    public ResponseEntity<List<MakeDto>> getMakes() {
        List<MakeDto> makes = makeService.getAllMake();
        return ResponseEntity.ok(makes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MakeDto> getMake(@PathVariable Long id) {
        MakeDto make = makeService.getMakeById(id);
        return ResponseEntity.ok(make);
    }

    @PostMapping("/add")
    public ResponseEntity<MakeDto> addMake(@Valid @RequestBody MakeRequest request) {
        MakeDto createdMake = makeService.createMake(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMake);
    }

    @PostMapping("/upsert")
    public ResponseEntity<MakeDto> upsertMake(@Valid @RequestBody MakeRequest request) {
        MakeDto make = makeService.upsertMake(request);
        return ResponseEntity.ok(make);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MakeDto> updateMake(@PathVariable Long id, @RequestBody MakeRequest request) {
        MakeDto make = makeService.updateMake(id, request);
        return ResponseEntity.ok(make);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMake(@PathVariable Long id) {
        makeService.deleteMake(id);
        return ResponseEntity.ok().build();
    }
}
