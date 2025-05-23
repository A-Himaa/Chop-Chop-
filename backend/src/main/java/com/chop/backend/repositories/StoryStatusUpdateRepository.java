package com.chop.backend.repositories;

import com.chop.backend.models.StoryStatusUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryStatusUpdateRepository extends MongoRepository<StoryStatusUpdate, String> {
    List<StoryStatusUpdate> findByUserId(String userId);
}
