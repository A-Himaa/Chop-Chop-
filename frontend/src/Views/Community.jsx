import React from "react";
import { Link } from "react-router-dom"; 
import "../Styles/community.css";
import state from "../Utils/store";
import CreatePost from "../components/Community/createpost";


const Community = () => {
  return (
    <div className="community-container">
      <header className="community-header">
        <img src="/assets/chopchop.svg" alt="ChopChop Logo" className="logo" />
        {/* <h1 className="logo-text">ChopChop</h1> */}
        <img
          src="/assets/User.png"
          alt="User Avatar"
          className="user-avatar"
        />
      </header>

      {/* New wrapper for the white card */}
      <div className="community-content-card">
        <section className="learning-plan">
          <div className="circle-placeholder">
            <img
              src="/assets/plus.png"
              alt="Create Story"
              className="learning-avatar"
            />
            {/* <p className="learntext">New Story</p> */}
          </div>
          
          {/* <div className="add-tag">
            <div className="circle-placeholder"></div>
            <p>+tag</p>
          </div> */}
        </section>
        <div className="storytext">Your Story</div>

         {/* Tabs Navigation Section */}
        <div className="tabs">
          <Link to="/explore" className="tab">Explore Recipes</Link>

          <button 
            className="tab" 
            onClick={() => state.createPostModalOpened = true} // This will open the modal
            style={{ border: "none", cursor: "pointer" }}
          >
            Share Recipes
          </button>
          <CreatePost />

          <Link to="/community" className="tab">Leaning Progress</Link>
          <Link to="/center" className="tab">Friends</Link>
        </div>

        <section className="skill-sharing">
          <div className="share-box">
            {/* <img src="/assets/User.png" alt="User" className="share-avatar" /> */}
            <input
              type="text"
              placeholder="What skill are you sharing today?"
              className="share-input"
            />
          </div>
          <div className="no-skills">
            <h3>No skill shares yet</h3>
            <p>Share your skills and knowledge with others!</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Community;
