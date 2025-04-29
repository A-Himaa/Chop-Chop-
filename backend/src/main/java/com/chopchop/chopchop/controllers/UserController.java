package com.chopchop.chopchop.controllers;

import com.chopchop.chopchop.models.User;
import com.chopchop.chopchop.models.Notification;
import com.chopchop.chopchop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User newUserData) {
        return userService.updateUser(id, newUserData);
    }

    @GetMapping("/{id}/followers")
    public List<String> getFollowers(@PathVariable String id) {
        return userService.getFollowers(id);
    }

    @GetMapping("/{id}/following")
    public List<String> getFollowing(@PathVariable String id) {
        return userService.getFollowing(id);
    }

    @PostMapping("/{followerId}/follow/{followeeId}")
    public void followUser(@PathVariable String followerId, @PathVariable String followeeId) {
        userService.followUser(followerId, followeeId);
    }

    @GetMapping("/{id}/notifications")
    public List<Notification> getNotifications(@PathVariable String id) {
        return userService.getNotifications(id);
    }

    @PutMapping("/{id}/notifications/read")
    public void markNotificationsAsRead(@PathVariable String id) {
        userService.markAllNotificationsAsRead(id);
    }
}
