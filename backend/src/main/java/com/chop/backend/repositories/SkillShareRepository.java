package com.chop.backend.repositories;

import com.chop.backend.models.SkillShare;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillShareRepository extends MongoRepository<SkillShare, String> {
    List<SkillShare> findByUserId(String userId);
}
