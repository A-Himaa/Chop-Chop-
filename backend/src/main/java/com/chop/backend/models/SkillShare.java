package com.chop.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "SkillShares")
@Getter
@Setter
public class SkillShare {
    @Id
    private String id;
    private String userId;
    private String mealDetails;
    private List<String> mediaUrls;  
    private List<String> mediaTypes; 
}