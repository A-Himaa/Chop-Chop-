package com.chopchop.chopchop.models;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    private String message;
    private boolean read = false;
    private Date createdAt = new Date();
}