import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import StoryCard from "./StoryCard";

const themeColors = {
  primary: "#FF6B35", 
  secondary: "#FF9E44",
  accent: "#7DCE82",
  background: "#FFF9F5", 
  surface: "#FFF0E6", 
  cardBg: "#FFFFFF", 
  textPrimary: "#2D2A32", 
  textSecondary: "#6D6A75",
  border: "rgba(255, 107, 53, 0.15)", 
  hover: "#E85A24", 
  danger: "#FF5252",
  success: "#27AE60", 
  gradient: "linear-gradient(135deg, #FF6B35 0%, #FF9E44 100%)", 
};

const StoryBox = () => {
  const snap = useSnapshot(state);
  return (
    <div>
      <p
      style={{
        background: themeColors.gradient,  
        color: "#FFFFFF",            
        padding: "8px 16px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "16px",
        height: 40,
        width: '100%',
        display: "inline-block",
        marginBottom: "16px",
  }}>Learning Plan Sharing</p>
      <div class="top_box">
        <div
          onClick={() => {
            state.createWorkoutStatusModalOpened = true;
          }}
          class="my_story_card"
        >
          <img alt="alt-tag" src={snap.currentUser?.image} />

          <div class="story_upload">
            <img alt="alt-tag" src="image/upload.png" />
            <p class="story_tag" style={{ textAlign: "center", fontSize: 8 }}>
              Create Learning story
            </p>
          </div>
        </div>
        {snap.storyCards.map((card) => (
          <StoryCard key={card?.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default StoryBox;
