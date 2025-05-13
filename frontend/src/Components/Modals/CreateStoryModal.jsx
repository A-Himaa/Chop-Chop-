import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
  Form,
  Slider,
  Typography,
  Card,
  Divider,
  Row,
  Col
} from "antd";
import { 
  UploadOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  CalendarOutlined,
  EditOutlined,
  TagOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";
import moment from "moment";

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
const learningIcons = ["🍳", "🍅", "🥕", "🥗", "🍚", "🍲", "🍕", "🍣", "🥩", "🥑", "🌽", "🌮"];

const uploader = new UploadFileService();
const { Option } = Select;
const { Text, Title, Paragraph } = Typography;

const CreateStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    recipeType: "",
    timeDuration: 30,
    intensity: "",
    image: ""
  });

  // Duration markers for slider
  const durationMarks = {
    0: '0',
    15: '15',
    30: '30',
    45: '45',
    60: '60',
    90: '90',
    120: '120'
  };

  // Function to get intensity color based on duration
  const getIntensityColor = (duration) => {
    if (duration < 15) return '#52c41a';     // Light green - Easy
    if (duration < 30) return '#1890ff';     // Blue - Moderate
    if (duration < 60) return '#faad14';     // Orange - Intense
    return '#f5222d';                        // Red - Very Intense
  };

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage,
        userId: snap.currentUser?.uid,
      };
      
      await StoryService.createWorkoutStory(body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Learning Plan created successfully");
      
      // Reset form and modal
      form.resetFields();
      setUploadedImage(null);
      state.createWorkoutStatusModalOpened = false;
    } catch (error) {
      message.error("Error creating Learning Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "workoutStories"
        );
        setUploadedImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
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
              <EditOutlined />
            </div>
            <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
              Create Learning Plan
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
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
      }}
      width={650}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            onClick={() => (state.createWorkoutStatusModalOpened = false)}
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
            loading={loading}
            key="create"
            type="primary"
            onClick={handleCreateWorkoutStory}
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
            {loading ? "Creating..." : "Create Learning Plan"}
          </Button>
        </div>
      }
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "20px",
        background: themeColors.cardBg,
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
        maxHeight: "calc(100vh - 300px)",
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
        💡
      </div>

      <Form 
        form={form} 
        layout="vertical"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            {uploadedImage ? (
              <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginBottom: '20px',
                position: 'relative'
              }}>
                <img
                  style={{ 
                    width: "100%", 
                    height: "220px",
                    objectFit: 'cover'
                  }}
                  src={uploadedImage}
                  alt="Learning Plan"
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '30px 16px 16px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                }}>
                  <Upload
                    accept="image/*"
                    onChange={handleFileChange}
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <Button 
                      icon={<UploadOutlined />} 
                      ghost
                      style={{ 
                        borderColor: 'white', 
                        color: 'white',
                        borderRadius: '10px',
                        height: '40px'
                      }}
                    >
                      Change Image
                    </Button>
                  </Upload>
                </div>
              </div>
            ) : (
              <div style={{
                marginBottom: '20px',
                border: `2px dashed ${themeColors.border}`,
                borderRadius: '12px',
                padding: '40px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: themeColors.background
              }}>
                {imageUploading ? (
                  <Text>Uploading image...</Text>
                ) : (
                  <Upload
                    accept="image/*"
                    onChange={handleFileChange}
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <UploadOutlined style={{ fontSize: '24px', color: themeColors.primary, marginBottom: '8px' }} />
                      <div>
                        <Text strong style={{ color: themeColors.textPrimary }}>Upload Plan Image</Text>
                        <br />
                      </div>
                    </div>
                  </Upload>
                )}
              </div>
            )}
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={16}>
            <Form.Item label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                  Title
                </span>
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </div>
            } name="title" rules={[{ required: true, message: 'Please input a title' }]}>
              <Input
                placeholder="Enter plan title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={{ 
                  borderRadius: 12, 
                  borderColor: themeColors.border,
                  padding: "10px 14px",
                  fontSize: "15px",
                  boxShadow: "none",
                  transition: "all 0.3s ease",
                  background: themeColors.background
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                  Date
                </span>
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </div>
            } name="timestamp">
              <DatePicker
                placeholder="Select date"
                style={{ 
                  width: "100%", 
                  borderRadius: 12,
                  borderColor: themeColors.border,
                  padding: "10px 14px",
                  height: "auto",
                  background: themeColors.background
                }}
                value={formData.timestamp}
                onChange={handleDateChange}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
              Recipe Type
            </span>
            <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
          </div>
        } name="recipeType">
          <Input
            placeholder="What type of Recipe?"
            name="recipeType"
            value={formData.recipeType}
            onChange={handleInputChange}
            style={{ 
              borderRadius: 12, 
              borderColor: themeColors.border,
              padding: "10px 14px",
              fontSize: "15px",
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
            color: themeColors.primary,
            fontWeight: 500
          }}>
            Duration & Intensity
          </div>
        </Divider>
        
        <Form.Item 
          label={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span style={{ display: "flex", alignItems: "center", fontWeight: 600, color: themeColors.textPrimary }}>
                <ClockCircleOutlined style={{ marginRight: "8px", color: themeColors.primary }} />
                Training Duration
              </span>
              <Text 
                strong 
                style={{ 
                  color: getIntensityColor(formData.timeDuration),
                  background: `${getIntensityColor(formData.timeDuration)}10`,
                  padding: "4px 10px",
                  borderRadius: "6px"
                }}
              >
                {formData.timeDuration} minutes
              </Text>
            </div>
          }
          name="timeDuration"
          style={{ marginBottom: 0 }}
        >
          <div style={{ 
            backgroundColor: themeColors.surface,
            padding: "20px",
            borderRadius: "12px",
            border: `1px dashed ${themeColors.border}`
          }}>
            <Slider
              min={0}
              max={120}
              step={15}
              value={formData.timeDuration}
              marks={durationMarks}
              tooltip={{ formatter: value => `${value} min` }}
              onChange={(value) => {
                setFormData({
                  ...formData,
                  timeDuration: value,
                });
              }}
            />
          </div>
        </Form.Item>

        <Form.Item 
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                Intensity Level
              </span>
              <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
            </div>
          } 
          name="intensity"
          style={{ marginTop: 20 }}
        >
          <Select
            placeholder="Select intensity level"
            style={{ 
              width: "100%", 
              borderRadius: 12,
            }}
            value={formData.intensity}
            onChange={handleIntensityChange}
            suffixIcon={<FireOutlined style={{ color: themeColors.primary }} />}
            dropdownStyle={{ borderRadius: 12 }}
          >
            <Option value="No Efforts">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FireOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                No Efforts
              </div>
            </Option>
            <Option value="Mid Efforts">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FireOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                Mid Efforts
              </div>
            </Option>
            <Option value="Moderate Efforts">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FireOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                Moderate Efforts
              </div>
            </Option>
            <Option value="Severe Efforts">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FireOutlined style={{ color: '#f5222d', marginRight: '8px' }} />
                Severe Efforts
              </div>
            </Option>
            <Option value="Maximal Efforts">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FireOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                Maximal Efforts
              </div>
            </Option>
          </Select>
        </Form.Item>
        
        <Form.Item 
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 600 }}>
                Description
              </span>
              <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
            </div>
          } 
          name="description"
        >
          <Input.TextArea
            placeholder="Add some details about this learning plan..."
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
      </Form>
    </Modal>
  );
};

export default CreateStoryModal;