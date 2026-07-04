package com.soulmap.server.repository;

import com.soulmap.server.entity.MbtiQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MbtiQuestionRepository extends JpaRepository<MbtiQuestion, Long> {

    List<MbtiQuestion> findAllByOrderBySttAsc();
}
