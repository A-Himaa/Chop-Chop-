package com.chop.backend.repositories;

import com.chop.backend.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
}
