package com.chopchop.chopchop.repositories;

import com.chopchop.chopchop.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

//Database access class

public interface PostRepository extends MongoRepository<Post, String>{
    List<Post> findByUserId(String userId);

}
