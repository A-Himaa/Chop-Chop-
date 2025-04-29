package com.chopchop.chopchop.service;

import com.chopchop.chopchop.models.User;
import com.chopchop.chopchop.models.Notification;
import com.chopchop.chopchop.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User updateUser(String id, User newUserData) {
        User user = userRepository.findById(id).orElseThrow();
        user.setFullName(newUserData.getFullName());
        user.setBio(newUserData.getBio());
        user.setAvatar(newUserData.getAvatar());
        return userRepository.save(user);
    }

    public List<String> getFollowers(String id) {
        User user = userRepository.findById(id).orElseThrow();
        return user.getFollowers();
    }

    public List<String> getFollowing(String id) {
        User user = userRepository.findById(id).orElseThrow();
        return user.getFollowing();
    }

    public void followUser(String followerId, String followeeId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User followee = userRepository.findById(followeeId).orElseThrow();

        if (!follower.getFollowing().contains(followeeId)) {
            follower.getFollowing().add(followeeId);
            followee.getFollowers().add(followerId);

            followee.getNotifications().add(new Notification(
                    follower.getUsername() + " started following you.",
                    false,
                    new Date()
            ));

            userRepository.save(follower);
            userRepository.save(followee);
        }
    }

    public List<Notification> getNotifications(String id) {
        User user = userRepository.findById(id).orElseThrow();
        return user.getNotifications();
    }

    public void markAllNotificationsAsRead(String id) {
        User user = userRepository.findById(id).orElseThrow();
        user.getNotifications().forEach(notification -> notification.setRead(true));
        userRepository.save(user);
    }
}
