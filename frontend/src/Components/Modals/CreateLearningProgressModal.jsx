import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography, Divider, Tooltip } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";
import { BookOutlined, TrophyOutlined, ToolOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
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

// Learning icons to display in the header instead of subtitle text
const learningIcons = ["📚", "✏️", "🎓", "📖", "🔍", "📝", "📊", "🏆", "💡", "📅", "🧠", "🧬"];

const CreateLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create Learning Progress data object
      const LearningProgressData = {
        userId: snap.currentUser?.uid,
        planName: values.planName,
        description: values.description,
        goal: values.goal,
        routines: values.routines,
      };

      await LearningProgressService.CreateLearningProgressModal(LearningProgressData);
      state.LearningProgresss = await LearningProgressService.getAllLearningProgresss();
      
      // Success message
      message.success("Learning Progress created successfully!");

      // Reset form and close modal
      form.resetFields();
      state.CreateLearningProgressModalOpened = false;
    } catch (error) {
      console.error("Form validation failed:", error);
      
      // Error message
      message.error("Failed to create Learning Progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    state.CreateLearningProgressModalOpened = false;
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
              <BookOutlined />
            </div>
            <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
              Share Learning Progress
            </Title>
          </div>
          
          {/* Learning icons rolling under the title instead of subtitle text */}
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
              {[...learningIcons, ...learningIcons].map((icon, index) => (
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
            {loading ? "Sharing..." : "Share Progress"}
          </Button>
        </Space>
      }
      visible={snap.CreateLearningProgressModalOpened}
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
        📚
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
        🎓
      </div>

      <Form form={form} layout="vertical" requiredMark="optional" style={{ position: "relative", zIndex: 1 }}>
        <Form.Item
          name="planName"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                Progress Title
              </span>
              <Tooltip title="A brief title summarizing your learning achievement">
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please add a title" }]}
        >
          <Input 
            placeholder="Give a brief title for your progress update" 
            style={{ 
              borderRadius: 12, 
              borderColor: themeColors.border,
              padding: "14px",
              fontSize: "15px",
              boxShadow: "none",
              transition: "all 0.3s ease",
              background: themeColors.background
            }} 
          />
        </Form.Item>
        
        <Form.Item
          name="description"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                Learning Journey
              </span>
              <Tooltip title="Share the details of your learning experience">
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea 
            placeholder="Describe your recent learning progress in detail" 
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
            Learning Details
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
          }}>📝</div>
          <div style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            fontSize: 16,
            opacity: 0.2,
          }}>🔍</div>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            marginBottom: 12, 
            color: themeColors.primary,
            fontWeight: 600
          }}>
            <TrophyOutlined style={{ marginRight: 8 }} />
            <span>Learning Resources & Achievements</span>
          </div>
          
          <Form.Item
            name="goal"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                  Tutorials & Resources Used
                </span>
              </div>
            }
            rules={[{ required: true, message: "Please enter tutorials" }]}
          >
            <Input 
              placeholder="Courses, tutorials, or books you used in this learning stage" 
              style={{ 
                borderRadius: 12,
                borderColor: themeColors.border,
                padding: "14px",
                background: themeColors.background,
                transition: "all 0.3s ease"
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="routines"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <ToolOutlined style={{ marginRight: 8, color: themeColors.primary }} />
                <span style={{ color: themeColors.textPrimary, fontWeight: 600 }}>Skills Acquired</span>
              </div>
            }
            rules={[{ required: true, message: "Please enter Skills" }]}
          >
            <Input.TextArea 
              placeholder="List specific skills, techniques, or concepts you've mastered" 
              rows={3}
              style={{ 
                borderRadius: 12,
                borderColor: themeColors.border,
                padding: "14px",
                fontSize: "15px",
                resize: "vertical",
                background: themeColors.background,
                transition: "all 0.3s ease"
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateLearningProgressModal;