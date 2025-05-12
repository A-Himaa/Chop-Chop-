import React, { useEffect, useState } from "react";
import "../../Styles/center_section.css";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import LearningProgressBox from "./LearningProgressBox";
import LearningProgressCard from "./LearningProgressCard";
import CreaetSkillShareBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown";
import { Tabs, Avatar, Row, Col, Badge, Typography, Spin } from "antd";

const { TabPane } = Tabs;
const { Title } = Typography;

// Enhanced theme colors with additional options for greater design depth
const themeColors = {
  primary: "#FF6B35",
  secondary: "#FF9E44",
  accent: "#7DCE82",
  border: "rgba(255, 107, 53, 0.15)",
  background: "#FFF9F5",
  surface: "#FFF0E6",
  cardBg: "#FFFFFF",
  textPrimary: "#2D2A32",
  textSecondary: "#6D6A75",
  hover: "#E85A24",
  gradient: "linear-gradient(135deg, #FF6B35 0%, #FF9E44 100%)"
};

// Animated tab indicators
const TabIndicator = ({ activeKey }) => {
  return (
    <style jsx="true">{`
      .tab-indicator-${activeKey} {
        position: absolute;
        bottom: 0;
        height: 4px;
        background: ${themeColors.gradient};
        border-radius: 4px 4px 0 0;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        box-shadow: 0 1px 8px rgba(255, 107, 53, 0.5);
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7); }
        70% { box-shadow: 0 0 0 6px rgba(255, 107, 53, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
      }
      
      .icon-${activeKey} {
        animation: pulse 1.5s infinite;
        border-radius: 50%;
      }
    `}</style>
  );
};

const CenterSection = () => {
  const snap = useSnapshot(state);
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);
  
  // Handle tab change with loading animation
  const handleTabChange = (key) => {
    setLoading(true);
    setActiveTab(key);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  // Tab icon components with animations
  const tabIcons = {
    "1": <i className={`fas fa-users icon-${activeTab === "1" ? "1" : ""}`} style={{ 
      color: activeTab === "1" ? themeColors.primary : themeColors.textSecondary,
      fontSize: activeTab === "1" ? "18px" : "16px",
      transition: "all 0.3s ease"
    }}></i>,
    "2": <i className={`fas fa-chart-line icon-${activeTab === "2" ? "2" : ""}`} style={{ 
      color: activeTab === "2" ? themeColors.primary : themeColors.textSecondary,
      fontSize: activeTab === "2" ? "18px" : "16px",
      transition: "all 0.3s ease"
    }}></i>,
    "3": <i className={`fas fa-share-alt icon-${activeTab === "3" ? "3" : ""}`} style={{ 
      color: activeTab === "3" ? themeColors.primary : themeColors.textSecondary,
      fontSize: activeTab === "3" ? "18px" : "16px",
      transition: "all 0.3s ease"
    }}></i>,
    "4": <i className={`fas fa-user-friends icon-${activeTab === "4" ? "4" : ""}`} style={{ 
      color: activeTab === "4" ? themeColors.primary : themeColors.textSecondary,
      fontSize: activeTab === "4" ? "18px" : "16px",
      transition: "all 0.3s ease"
    }}></i>
  };

  return (
    <div className="center" style={{
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px 24px",
      background: themeColors.background,
      minHeight: "100vh"
    }}>
      <TabIndicator activeKey={activeTab} />
      
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        marginBottom: "24px",
        background: themeColors.cardBg,
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(255, 107, 53, 0.1)"
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: themeColors.primary
          }}
        >
          <img 
            style={{ 
              maxHeight: 60,
              filter: "drop-shadow(0 2px 4px rgba(255, 107, 53, 0.2))"
            }} 
            src="/assets/chopchop.svg" 
            alt="logo" 
          />
          <span style={{ 
            background: themeColors.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            ChopChop
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Badge count={snap.notifications?.length || 0} offset={[-5, 5]}>
            <Avatar
              style={{
                cursor: "pointer",
                border: `3px solid ${themeColors.primary}`,
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
                transition: "all 0.3s ease",
                transform: "scale(1)",
                ":hover": {
                  transform: "scale(1.05)"
                }
              }}
              onClick={() => {
                state.profileModalOpend = true;
              }}
              size={60}
              src={snap.currentUser?.image}
            />
          </Badge>
        </div>
      </nav>
      
      <StoryBox />
      
      <div style={{
        backgroundColor: themeColors.cardBg,
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        marginBottom: "24px",
        border: `1px solid ${themeColors.border}`,
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated background elements */}
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${themeColors.secondary}10, ${themeColors.primary}05)`,
          top: "-150px",
          right: "-150px",
          zIndex: 0
        }} />
        
        <div style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${themeColors.primary}05, ${themeColors.secondary}10)`,
          bottom: "-100px",
          left: "-100px",
          zIndex: 0
        }} />
      
        <NotificationsDropdown />
        
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ 
            width: "100%",
            position: "relative",
            zIndex: 1
          }}
          tabBarStyle={{ 
            marginBottom: "24px", 
            fontWeight: "600",
            borderBottom: `2px solid ${themeColors.border}`
          }}
          tabBarGutter={36}
          animated={{ inkBar: true, tabPane: true }}
          renderTabBar={(props, DefaultTabBar) => (
            <DefaultTabBar {...props} style={{ 
              marginBottom: "20px", 
              transition: "all 0.3s ease" 
            }} />
          )}
        >
          <TabPane 
            tab={
              <div style={{ 
                padding: "8px 12px",
                borderRadius: "8px",
                background: activeTab === "1" ? `${themeColors.primary}15` : "transparent",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                {tabIcons["1"]}
                <span style={{ 
                  fontSize: "16px",
                  fontWeight: activeTab === "1" ? 700 : 600,
                  color: activeTab === "1" ? themeColors.primary : themeColors.textPrimary,
                  transition: "all 0.3s ease"
                }}>
                  Posts
                </span>
              </div>
            } 
            key="1"
          >
            <div style={{
              opacity: loading ? 0 : 1,
              transform: loading ? "translateY(10px)" : "translateY(0)",
              transition: "all 0.5s ease"
            }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <MyPost />
                  <div style={{ marginTop: "24px" }}>
                    {snap.posts.length === 0 ? (
                      <div style={{
                        padding: "32px",
                        textAlign: "center",
                        background: themeColors.surface,
                        borderRadius: "12px",
                        color: themeColors.textSecondary
                      }}>
                        <i className="fas fa-comment-slash" style={{ fontSize: "32px", marginBottom: "16px" }}></i>
                        <Title level={4}>No posts yet</Title>
                        <p>Be the first to share the dish with your friends!</p>
                      </div>
                    ) : (
                      snap.posts.map((post, index) => {
                        return <div
                          key={post?.id}
                          style={{
                            animation: `fadeInUp 0.3s ease forwards`,
                            animationDelay: `${index * 0.1}s`,
                            opacity: 0,
                            transform: "translateY(20px)"
                          }}
                        >
                          <FriendsPost post={post} />
                        </div>
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <div style={{ 
                padding: "8px 12px",
                borderRadius: "8px",
                background: activeTab === "2" ? `${themeColors.primary}15` : "transparent",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                {tabIcons["2"]}
                <span style={{ 
                  fontSize: "16px",
                  fontWeight: activeTab === "2" ? 700 : 600,
                  color: activeTab === "2" ? themeColors.primary : themeColors.textPrimary,
                  transition: "all 0.3s ease"
                }}>
                  Learning Progress
                </span>
              </div>
            } 
            key="2"
          >
            <div style={{
              opacity: loading ? 0 : 1,
              transform: loading ? "translateY(10px)" : "translateY(0)",
              transition: "all 0.5s ease"
            }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <LearningProgressBox />
                  <div style={{ marginTop: "24px" }}>
                    {snap.LearningProgresss.length === 0 ? (
                      <div style={{
                        padding: "32px",
                        textAlign: "center",
                        background: themeColors.surface,
                        borderRadius: "12px",
                        color: themeColors.textSecondary
                      }}>
                        <i className="fas fa-book" style={{ fontSize: "32px", marginBottom: "16px" }}></i>
                        <Title level={4}>No learning progress yet</Title>
                        <p>Start tracking your learning journey!</p>
                      </div>
                    ) : (
                      snap.LearningProgresss.map((plan, index) => (
                        <div
                          key={plan.id}
                          style={{
                            animation: `fadeInUp 0.3s ease forwards`,
                            animationDelay: `${index * 0.1}s`,
                            opacity: 0,
                            transform: "translateY(20px)"
                          }}
                        >
                          <LearningProgressCard plan={plan} />
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <div style={{ 
                padding: "8px 12px",
                borderRadius: "8px",
                background: activeTab === "3" ? `${themeColors.primary}15` : "transparent",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                {tabIcons["3"]}
                <span style={{ 
                  fontSize: "16px",
                  fontWeight: activeTab === "3" ? 700 : 600,
                  color: activeTab === "3" ? themeColors.primary : themeColors.textPrimary,
                  transition: "all 0.3s ease"
                }}>
                  Explore Recipe
                </span>
              </div>
            } 
            key="3"
          >
            <div style={{
              opacity: loading ? 0 : 1,
              transform: loading ? "translateY(10px)" : "translateY(0)",
              transition: "all 0.5s ease"
            }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <div style={{ 
                    padding: "20px", 
                    background: themeColors.surface,
                    borderRadius: "12px",
                    marginBottom: "24px",
                    boxShadow: "inset 0 2px 6px rgba(255, 107, 53, 0.1)",
                    border: `1px dashed ${themeColors.border}`,
                    animation: "fadeIn 0.5s ease"
                  }}>
                    <CreaetSkillShareBox />
                  </div>
                  
                  <Row gutter={[24, 24]} style={{ marginTop: "16px" }}>
                    {snap.SkillShares.length === 0 ? (
                      <Col span={24}>
                        <div style={{
                          padding: "32px",
                          textAlign: "center",
                          background: themeColors.surface,
                          borderRadius: "12px",
                          color: themeColors.textSecondary
                        }}>
                          <i className="fas fa-lightbulb" style={{ fontSize: "32px", marginBottom: "16px" }}></i>
                          <Title level={4}>No recipes shared yet</Title>
                          <p>Share your yummy recipes with others!</p>
                        </div>
                      </Col>
                    ) : (
                      snap.SkillShares.map((plan, index) => (
                        <Col 
                          xs={24} sm={24} md={12} lg={8} 
                          key={plan.id}
                          style={{
                            animation: `fadeInUp 0.3s ease forwards`,
                            animationDelay: `${index * 0.1}s`,
                            opacity: 0,
                            transform: "translateY(20px)"
                          }}
                        >
                          <SkillShareCard plan={plan} />
                        </Col>
                      ))
                    )}
                  </Row>
                </>
              )}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <div style={{ 
                padding: "8px 12px",
                borderRadius: "8px",
                background: activeTab === "4" ? `${themeColors.primary}15` : "transparent",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                {tabIcons["4"]}
                <span style={{ 
                  fontSize: "16px",
                  fontWeight: activeTab === "4" ? 700 : 600,
                  color: activeTab === "4" ? themeColors.primary : themeColors.textPrimary,
                  transition: "all 0.3s ease"
                }}>
                  Friends
                </span>
              </div>
            } 
            key="4"
          >
            <div style={{
              opacity: loading ? 0 : 1,
              transform: loading ? "translateY(10px)" : "translateY(0)",
              transition: "all 0.5s ease"
            }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <FriendsSection />
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
      
      {/* Global animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CenterSection;