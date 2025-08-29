package com.carlog.carlog_backend.car._details.repository;

import com.carlog.carlog_backend.car._details.entity.Make;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MakeRepository extends JpaRepository<Make, Long> {
    Optional<Make> findByName(String name);

    @Modifying
    @Query("UPDATE Make m SET m.active = false WHERE m.active IS true")
    void deactivateAllMake();
}
