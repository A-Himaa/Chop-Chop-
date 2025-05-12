import React, { useState } from "react";
import state from "../../Utils/Store";
import { useSnapshot } from "valtio";

// Theme colors (matching the previous component)
const themeColors = {
  primary: "#FF6B35", // Vibrant orange for primary actions
  secondary: "#FF9E44", // Lighter orange for secondary elements
  accent: "#7DCE82", // Fresh green accent
  background: "#FFF9F5", // Warm off-white background
  surface: "#FFF0E6", // Slightly darker surface for contrast
  cardBg: "#FFFFFF", // Crisp white for cards
  textPrimary: "#2D2A32", // Dark charcoal for readability
  textSecondary: "#6D6A75", // Medium gray for secondary text
  border: "rgba(255, 107, 53, 0.15)", // Subtle orange-tinted border
  hover: "#E85A24", // Darker orange for hover states
  danger: "#FF5252", // Clear red for warnings
  success: "#27AE60", // Fresh green for success messages
  gradient: "linear-gradient(135deg, #FF6B35 0%, #FF9E44 100%)", // Orange gradient
};
const SkillShareBox = () => {
  const snap = useSnapshot(state);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div

  // Search box for skill sharing
      className="my_post"
      onClick={() => {
        state.createSkillShareOpened = true;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: themeColors.gradient,
        padding: "16px 20px",
        borderRadius: "12px",
        boxShadow: isHovered 
          ? "0 8px 24px rgba(90, 155, 255, 0.2)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginBottom: "20px",
        color: "white",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.2)" : "transparent"}`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decoration for search box*/}
      <div 
        style={{ 
          position: "absolute", 
          right: -20, 
          top: -20, 
          width: 100, 
          height: 100, 
          borderRadius: "50%", 
          background: "rgba(255,255,255,0.15)",
          zIndex: 1,
          transition: "transform 0.5s ease-in-out",
          transform: isHovered ? "scale(1.2)" : "scale(1)"
        }} 
      />
      
      <div 
        style={{ 
          position: "absolute", 
          left: 10, 
          bottom: -30, 
          width: 60, 
          height: 60, 
          borderRadius: "50%", 
          background: "rgba(255,255,255,0.15)",
          zIndex: 1,
          transition: "transform 0.5s ease-in-out",
          transform: isHovered ? "scale(1.2) translateX(10px)" : "scale(1)"
        }} 
      />

      <div
        className="post_top"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          position: "relative", 
          zIndex: 2 
        }}
      >
        <img
          alt={snap.currentUser?.username || "Profile"}
          src={snap.currentUser?.image}
          style={{
            width: "45px",
            height: "45px",
            marginRight: "15px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.7)",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            boxShadow: isHovered ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none"
          }}
        />


        <input
          type="text"
          placeholder={`Got a dish that’s too good to keep secret? Drop your recipe magic here!, ${snap.currentUser?.username || "User"}? 🤗`}
          style={{
            flexGrow: 1,
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            color: themeColors.textPrimary,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            fontSize: "17px",
            transition: "all 0.3s ease",
            boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 2px 6px rgba(0, 0, 0, 0.04)",
            outline: "none"
          }}
          readOnly 
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default SkillShareBox;