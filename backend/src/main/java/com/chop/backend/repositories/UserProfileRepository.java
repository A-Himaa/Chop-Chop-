package com.chop.backend.repositories;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.chop.backend.models.UserProfile;

import java.util.List;

@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    List<UserProfile> findByUserId(String userId);
}
