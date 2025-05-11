import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Space, Typography, Divider, Tooltip } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, FileImageOutlined, VideoCameraOutlined, InfoCircleOutlined, CameraOutlined } from "@ant-design/icons";
import PostService from "../../Services/PostService";

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

const { Title, Text, Paragraph } = Typography;
const uploader = new UploadFileService();

// Food icons to display in the header instead of subtitle text
const foodIcons = ["🍳", "🍅", "🥕", "🥗", "🍚", "🍲", "🍕", "🍣", "🥩", "🥑", "🌽", "🌮"];

const CreatePostModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const body = {
        ...values,
        mediaLink: image,
        userId: snap.currentUser?.uid,
        mediaType: fileType,
      };
      await PostService.createPost(body);
      state.posts = await PostService.getPosts();
      message.success("Recipe shared successfully");
      state.createPostModalOpened = false;
      form.resetFields();
      setImage("");
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("Failed to share recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = async (info) => {
    if (info.file) {
      try {
        setImageUploading(true);
        const fileType = info.file.type.split("/")[0];
        setFileType(fileType);
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "posts"
        );
        setImage(url);
        form.setFieldsValue({ mediaLink: url });
        message.success(`${fileType} uploaded successfully`);
      } catch (error) {
        message.error("Upload failed. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setImageUploading(false);
      }
    } else if (info.file.status === "removed") {
      setImage("");
      form.setFieldsValue({ mediaLink: "" });
    }
  };
  
  const handleCancel = () => {
    form.resetFields();
    setImage("");
    state.createPostModalOpened = false;
  };

  const MediaPreview = () => {
    if (!image) return null;
    
    if (fileType === "image") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div style={{
            padding: 12,
            background: themeColors.surface,
            borderRadius: 16,
            border: `1px solid ${themeColors.border}`,
            position: "relative",
            overflow: "hidden"
          }}>
            <img
              src={image}
              alt="Recipe Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.15)"
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(255, 255, 255, 0.85)",
              borderRadius: 20,
              padding: "5px 12px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}>
              <Text strong style={{ color: themeColors.primary }}>Delicious!</Text>
            </div>
          </div>
        </div>
      );
    }
    
    if (fileType === "video") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div style={{
            padding: 12,
            background: themeColors.surface,
            borderRadius: 16,
            border: `1px solid ${themeColors.border}`,
            position: "relative"
          }}>
            <video
              controls
              src={image}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.15)"
              }}
            />
            <div style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "rgba(255, 255, 255, 0.85)",
              borderRadius: 20,
              padding: "5px 12px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}>
              <Text strong style={{ color: themeColors.primary }}>Recipe Video</Text>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Modal
      title={
        <div style={{ marginBottom: 8 }}>
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8
          }}>
            <div style={{
              background: themeColors.primary,
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 18
            }}>
              <CameraOutlined />
            </div>
            <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
              Share Your Recipe
            </Title>
          </div>
          
          {/* Food icons rolling under the title instead of subtitle text */}
          <div style={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "4px 0",
            overflow: "hidden",
            position: "relative",
            height: "28px",
            marginBottom: "4px"
          }}>
            <div style={{
              display: "flex",
              position: "absolute",
              animation: "scrollIcons 20s linear infinite",
              gap: "12px"
            }}>
              {[...foodIcons, ...foodIcons].map((icon, index) => (
                <span 
                  key={index} 
                  style={{ 
                    fontSize: "18px",
                    opacity: index % 2 === 0 ? 0.9 : 0.7,
                    transform: `scale(${index % 3 === 0 ? 1.2 : 1})`,
                  }}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
          
          {/* Decorative line */}
          <div style={{ 
            height: "2px", 
            background: themeColors.gradient,
            borderRadius: "2px",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: themeColors.primary,
              left: "20%",
              top: "-3px"
            }} />
            <div style={{
              position: "absolute",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: themeColors.secondary,
              left: "60%",
              top: "-2px"
            }} />
            <div style={{
              position: "absolute",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: themeColors.accent,
              left: "80%",
              top: "-2px"
            }} />
          </div>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      visible={state.createPostModalOpened}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "28px",
        background: themeColors.cardBg,
        borderRadius: 16,
        position: "relative",
        overflow: "hidden"
      }}
      style={{ 
        borderRadius: 20,
        overflow: "hidden"
      }}
    >
      {/* Animation keyframes */}
      <style>
        {`
          @keyframes scrollIcons {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
      
      {/* Background decorative elements */}
      <div style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: themeColors.accent,
        opacity: 0.05,
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: -40,
        left: -40,
        width: 150,
        height: 150,
        borderRadius: "50%",
        background: themeColors.primary,
        opacity: 0.05,
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        top: "50%",
        right: -100,
        transform: "translateY(-50%)",
        fontSize: 120,
        color: themeColors.primary,
        opacity: 0.03,
        zIndex: 0
      }}>
        🍳
      </div>
      <div style={{
        position: "absolute",
        bottom: 20,
        left: "25%",
        fontSize: 80,
        color: themeColors.secondary,
        opacity: 0.03,
        zIndex: 0
      }}>
        🥗
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional" style={{ position: "relative", zIndex: 1 }}>
        <Form.Item
          name="contentDescription"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                Describe Your Dish
              </span>
              <Tooltip title="Share the story, ingredients, or cooking method behind your dish">
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[
            { required: true, message: "Please describe your culinary creation" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="What did you cook? Share the recipe, ingredients, or your cooking experience..."
            style={{ 
              borderRadius: 12, 
              borderColor: themeColors.border,
              padding: "14px",
              fontSize: "15px",
              resize: "vertical",
              boxShadow: "none",
              transition: "all 0.3s ease",
              background: themeColors.background
            }}
          />
        </Form.Item>
        
        <Divider style={{ 
          margin: "20px 0", 
          borderColor: themeColors.border,
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: themeColors.cardBg,
            padding: "0 12px",
            fontSize: 16,
            color: themeColors.primary
          }}>
            Add Media
          </div>
        </Divider>
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          background: themeColors.surface,
          padding: "20px",
          borderRadius: 16,
          marginBottom: 20,
          border: `1px dashed ${themeColors.border}`,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Small food icon decorations */}
          <div style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 16,
            opacity: 0.2,
          }}>🍽️</div>
          <div style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            fontSize: 16,
            opacity: 0.2,
          }}>🥄</div>

          <Form.Item
            name="mediaLink"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                  Show Off Your Dish
                </span>
                <Tooltip title="Upload a photo or video of your delicious creation">
                  <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
                </Tooltip>
              </div>
            }
            rules={[{ required: true, message: "Please upload an image or video of your dish" }]}
            style={{ marginBottom: imageUploading ? 12 : 0 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Upload
                accept="image/*,video/*"
                onChange={handleFileChange}
                showUploadList={false}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button 
                  icon={image ? (fileType === "image" ? <FileImageOutlined /> : <VideoCameraOutlined />) : <UploadOutlined />}
                  disabled={imageUploading}
                  style={{
                    borderRadius: 12,
                    background: image ? themeColors.success : themeColors.gradient,
                    borderColor: image ? themeColors.success : themeColors.primary,
                    color: "white",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 8px rgba(255, 107, 53, 0.2)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {imageUploading ? "Uploading..." : image ? `${fileType} Uploaded` : "Upload Dish Photo/Video"}
                </Button>
              </Upload>
              
              {image && (
                <Text type="success" style={{ fontSize: 14, fontWeight: 500 }}>
                  Looks delicious! Ready to share!
                </Text>
              )}
            </div>
          </Form.Item>
          
          {imageUploading && (
            <div style={{ 
              textAlign: "center", 
              margin: "10px 0", 
              padding: "10px",
              background: "rgba(255, 107, 53, 0.1)",
              borderRadius: 12
            }}>
              <Text style={{ color: themeColors.primary }}>
                Preparing your dish for the spotlight...
              </Text>
            </div>
          )}
        </div>
        
        <MediaPreview />
        
        <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={handleCancel}
              style={{
                borderRadius: 12,
                height: "44px",
                padding: "0 20px",
                borderColor: themeColors.border,
                color: themeColors.textPrimary
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={imageUploading || !image}
              style={{
                background: themeColors.gradient,
                borderColor: themeColors.primary,
                borderRadius: 12,
                height: "44px",
                padding: "0 24px",
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
                transition: "all 0.3s ease",
                fontWeight: 600
              }}
            >
              {loading ? "Sharing..." : "Share Recipe"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;