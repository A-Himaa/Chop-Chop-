import React, { useState } from "react";
import { Card, Carousel, Button, Row, Col, Typography, Modal, Space } from "antd";
import { useSnapshot } from "valtio";
import { UploadOutlined } from "@ant-design/icons";
import state from "../../Utils/Store";
import { 
  EditOutlined, 
  DeleteOutlined, 
  ExpandOutlined,
  ShareAltOutlined, 
  HeartOutlined,
  HeartFilled,
  MessageOutlined
} from "@ant-design/icons";
import SkillShareService from "../../Services/SkillShareService";

const { Title, Text, Paragraph } = Typography;

// Theme colors
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

const SkillShareCard = ({ plan }) => {
  const snap = useSnapshot(state);
  const [deleteLoading, setIsDeleteLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState({ url: '', type: 'image' });
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  
  const deletePlan = async () => {
    try {
      setIsDeleteLoading(true);
      await SkillShareService.deleteSkillShare(plan.id);
      state.SkillShares = await SkillShareService.getAllSkillShares();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };
  
  const handlePreview = (url, type) => {
    setPreviewMedia({ url, type });
    setPreviewVisible(true);
  };
  
  const renderMediaItem = (url, type, index) => {
    return type === "image" ? (
      <div key={index} className="media-container" onClick={() => handlePreview(url, type)}>
        <img
          src={url}
          alt={`Media ${index + 1}`}
          style={{ 
            width: "100%", 
            height: 300, 
            objectFit: "cover", 
            cursor: "pointer" 
          }}
        />
        <div className="media-overlay">
          <ExpandOutlined style={{ fontSize: 24, color: "white" }} />
        </div>
        <style jsx>{`
          .media-container {
            position: relative;
            overflow: hidden;
          }
          .media-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.17);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .media-container:hover .media-overlay {
            opacity: 1;
          }
        `}</style>
      </div>
    ) : (
      <div key={index} className="media-container">
        <video
          src={url}
          controls
          style={{ 
            width: "100%", 
            height: 300, 
            objectFit: "cover"
          }}
        />
      </div>
    );
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
          border: `1px solid ${themeColors.border}`
        }}
        bodyStyle={{ padding: 0 }}
        bordered={false}
      >
        <div style={{
          background: themeColors.gradient,
          padding: "16px 20px",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          position: "relative",
          overflow: "hidden"
        }}>
          <div 
            style={{ 
              position: "absolute", 
              right: -30, 
              top: -30, 
              width: 120, 
              height: 120, 
              borderRadius: "50%", 
              background: "rgba(255,255,255,0.15)",
              zIndex: 1
            }} 
          />
          <div 
            style={{ 
              position: "absolute", 
              right: 20, 
              bottom: -40, 
              width: 80, 
              height: 80, 
              borderRadius: "50%", 
              background: "rgba(255,255,255,0.15)",
              zIndex: 1
            }} 
          />
          
          <Row justify="space-between" align="middle" style={{ position: "relative", zIndex: 2 }}>
            <Col>
              <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {new Date(plan.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </Col>
          </Row>
        </div>
        
        <div style={{ padding: 0 }}>
          {plan.mediaUrls && plan.mediaUrls.length > 0 ? (
            <Carousel
              autoplay={false}
              dots={plan.mediaUrls.length > 1}
              style={{ marginBottom: 16 }}
            >
              {plan.mediaUrls.map((url, index) => (
                renderMediaItem(
                  url, 
                  plan.mediaTypes ? plan.mediaTypes[index] : "image",
                  index
                )
              ))}
            </Carousel>
          ) : (
            <div style={{ 
              height: 150, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              background: themeColors.surface,
              color: themeColors.textSecondary,
              fontSize: 16
            }}>
              No media available
            </div>
          )}
        </div>
        
        <div style={{ padding: "16px 24px", background: themeColors.cardBg }}>
          <Paragraph 
            style={{ 
              fontSize: 15, 
              marginBottom: 8,
              whiteSpace: "pre-line",
              color: themeColors.textPrimary,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: isExpanded ? "none" : 3, 
              WebkitBoxOrient: "vertical",
              maxHeight: isExpanded ? "none" : "4.5em", 
            }}
          >
            {plan.mealDetails}
          </Paragraph>
          <Button 
            type="link" 
            style={{ padding: 0 }} 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Read less" : "Read more"}
          </Button>

          
          <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
            <Col>
              <Space size="large">
                <Button 
                  type="text" 
                  icon={liked ? <HeartFilled style={{ color: themeColors.danger }} /> : <HeartOutlined />}
                  onClick={() => setLiked(!liked)}
                  style={{ color: themeColors.textSecondary }}
                >
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button 
                  type="text" 
                  icon={<MessageOutlined />}
                  style={{ color: themeColors.textSecondary }}
                >
                  Comment
                </Button>
                <Button 
                  type="text" 
                  icon={<ShareAltOutlined />}
                  style={{ color: themeColors.textSecondary }}
                >
                  Share
                </Button>
              </Space>
            </Col>
            
            {plan.userId === snap.currentUser?.uid && (
              <Col>
                <Space>
                  <Button
                    onClick={() => {
                      state.seletedSkillShareToUpdate = plan;
                      state.updateSkillShareOpened = true;
                    }}
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ 
                      background: themeColors.primary, 
                      borderColor: themeColors.primary,
                      borderRadius: 8,
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)"
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={deletePlan}
                    loading={deleteLoading}
                    danger
                    icon={<DeleteOutlined />}
                    style={{ 
                      borderRadius: 8,
                      transition: "all 0.2s"
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              </Col>
            )}
          </Row>
        </div>
      </Card>
      
      <Modal
        visible={previewVisible}
        title="Media Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
        bodyStyle={{ padding: 0 }}
      >
        {previewMedia.type === "image" ? (
          <img
            alt="Preview"
            src={previewMedia.url}
            style={{ width: "100%" }}
          />
        ) : (
          <video
            src={previewMedia.url}
            controls
            style={{ width: "100%" }}
            autoPlay
          />
        )}
      </Modal>
    </>
  );
};

export default SkillShareCard;