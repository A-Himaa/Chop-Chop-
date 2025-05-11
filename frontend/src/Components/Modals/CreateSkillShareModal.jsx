import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col, Typography, Space, Divider, Tooltip } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillShareService from "../../Services/SkillShareService";
import UploadFileService from "../../Services/UploadFileService";
import { 
  UploadOutlined, 
  DeleteOutlined, 
  InboxOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  FileImageOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const uploader = new UploadFileService();

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

// Skill icons to display in the header instead of subtitle text
const skillIcons = ["🔧", "💪", "🎨", "🚀", "🛠️", "⚙️", "🎯", "🧠", "🧩", "🕹️", "🧰", "🧪"];

const CreateSkillShareModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Call the service to create the Skill Share
      await SkillShareService.createSkillShare({
        ...values,
        userId: snap.currentUser?.uid,
        mediaUrls: mediaFiles.map(file => file.url),
        mediaTypes: mediaFiles.map(file => file.type)
      });
      state.SkillShares = await SkillShareService.getAllSkillShares();
      
      // Reset the form and close the modal on success
      form.resetFields();
      setMediaFiles([]);
      state.createSkillShareOpened = false;
    } catch (error) {
      console.error("Error creating Skill Share:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've selected ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      // Reset the file input
      e.target.value = null;
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 30);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMediaFile = (uid) => {
    setMediaFiles(prev => prev.filter(file => file.uid !== uid));
  };

  const renderMediaPreview = () => {
    return (
      <>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: 12, 
          color: themeColors.primary,
          fontWeight: 600
        }}>
          <FileImageOutlined style={{ marginRight: 8 }} />
          <span>Uploaded Media Files ({mediaFiles.length}/3)</span>
        </div>
        <Row gutter={[16, 16]}>
          {mediaFiles.map(file => (
            <Col key={file.uid} span={8}>
              <div style={{ position: 'relative' }}>
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 12,
                      border: `1px solid ${themeColors.border}`
                    }}
                  />
                ) : (
                  <video 
                    src={file.url} 
                    controls
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 12,
                      border: `1px solid ${themeColors.border}`
                    }}
                  />
                )}
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeMediaFile(file.uid)}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 8
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadingMedia || mediaFiles.length >= 3) return;
    
    const files = Array.from(e.dataTransfer.files);
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've dropped ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        // Check if file is image or video
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          alert(`File "${file.name}" is not an image or video.`);
          return null;
        }
        
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setMediaFiles([]);
    state.createSkillShareOpened = false;
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
              <ShareAltOutlined />
            </div>
            <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
              Share Your Skills
            </Title>
          </div>
          
          {/* Skill icons rolling under the title instead of subtitle text */}
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
              {[...skillIcons, ...skillIcons].map((icon, index) => (
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
      footer={
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
            onClick={handleSubmit}
            loading={loading}
            disabled={mediaFiles.length === 0 || uploadingMedia}
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
            {loading ? "Sharing..." : "Share Skill"}
          </Button>
        </Space>
      }
      visible={snap.createSkillShareOpened}
      onCancel={handleCancel}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "28px",
        background: themeColors.cardBg,
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto"
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
        🔧
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
        ✨
      </div>

      <Form form={form} layout="vertical" requiredMark="optional" style={{ position: "relative", zIndex: 1 }}>
        <Form.Item
          name="mealDetails"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                Skill Description
              </span>
              <Tooltip title="Share detailed information about your skills or techniques">
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please share details about your skills" }]}
        >
          <Input.TextArea 
            placeholder="Describe your skills, techniques, or areas of expertise in detail" 
            rows={4}
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
            Media Upload
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
          {/* Small icon decorations */}
          <div style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 16,
            opacity: 0.2,
          }}>🎨</div>
          <div style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            fontSize: 16,
            opacity: 0.2,
          }}>🎯</div>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            marginBottom: 12, 
            color: themeColors.primary,
            fontWeight: 600
          }}>
            <UploadOutlined style={{ marginRight: 8 }} />
            <span>Upload Media ({mediaFiles.length}/3)</span>
          </div>
        
          <div 
            style={{ 
              border: `2px dashed ${themeColors.border}`, 
              borderRadius: '12px', 
              padding: '24px', 
              textAlign: 'center',
              background: themeColors.background,
              cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
              marginBottom: mediaFiles.length > 0 ? '20px' : '0'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p><InboxOutlined style={{ fontSize: '48px', color: themeColors.primary }} /></p>
            <p style={{ margin: '12px 0', color: themeColors.textPrimary, fontWeight: 500 }}>
              Click or drag files to this area to upload
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              {mediaFiles.length >= 3 ? 
                "Maximum number of files reached" : 
                `Select up to ${3 - mediaFiles.length} files at once. Supports images and videos.`}
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInputChange}
              disabled={mediaFiles.length >= 3 || uploadingMedia}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer'
              }}
            />
          </div>
          {uploadingMedia && (
            <div style={{ 
              color: themeColors.primary, 
              marginTop: 12,
              textAlign: 'center',
              fontWeight: 500,
              padding: '8px',
              background: 'rgba(255, 107, 53, 0.1)',
              borderRadius: '8px'
            }}>
              <span style={{ marginRight: 8 }}>⏳</span>
              Media is uploading, please wait...
            </div>
          )}
          
          {mediaFiles.length > 0 && renderMediaPreview()}
        </div>
      </Form>
    </Modal>
  );
};

export default CreateSkillShareModal;