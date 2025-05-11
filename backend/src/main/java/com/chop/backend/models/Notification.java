package com.chop.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

<<<<<<<< HEAD:backend/src/main/java/com/chop/backend/models/Notification.java
@Document(collection = "notifications")
@Getter
@Setter
public class Notification {
    @Id
    private String id;
    private String userId;
    private String message;
    private String description;
========
@Getter
@Setter
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private Date timestamp;
    private String contentDescription;
    private String mediaLink;
    private String mediaType;
>>>>>>>> 30bf0d8b55a2f2e8756abc5fec22c2ed74e26326:backend/src/main/java/com/chop/backend/models/Post.java
}

