package com.carlog.carlog_backend.car._details.repository;

import com.carlog.carlog_backend.car._details.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    public List<Model> findAllByMakeId(Long makeId);

    public Optional<Model> findByMakeIdAndName(Long makeId, String name);

    @Modifying
    @Query("UPDATE Model m SET m.active = false WHERE m.active IS true")
    void deactivateAllModel();
}
