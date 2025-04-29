import React, { useState } from "react";
import "../../Styles/profile.css";

const Profile = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have a new follower!" },
    { id: 2, message: "Your post received 5 likes." },
    { id: 3, message: "New comment on your recipe." },
  ]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="/assets/User.png" alt="Profile" className="profile-avatar" />

        <div className="profile-info">
          <div className="profile-top-row">
            <h2 className="username">username123</h2>
            <button className="edit-btn">Edit Profile</button>
            <button className="share-post-btn">Share Post</button>
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img src="/assets/bell.png" alt="Notifications" className="notification-icon" />
            </button>
          </div>

          <div className="profile-stats">
            <span><strong>10</strong> posts</span>
            <span><strong>120</strong> followers</span>
            <span><strong>80</strong> following</span>
          </div>

          <div className="bio">
            <p><strong>Full Name</strong></p>
            <p>This is the user bio or description.</p>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="notification-panel">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((notif) => (
              <p key={notif.id} className="notification-item">{notif.message}</p>
            ))
          )}
        </div>
      )}

      <div className="profile-posts">
        <div className="posts-header">
          <h3>Posts</h3>
        </div>
        <div className="post-gallery">
          <img className="post-card" src="assets\1.png"></img>
          <img className="post-card" src="assets\1.png"></img>
          <img className="post-card" src="assets\1.png"></img>
        </div>
      </div>
    </div>
  );
};

export default Profile;
