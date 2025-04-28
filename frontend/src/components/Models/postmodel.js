import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Space, Typography, Tooltip } from "antd";
import { UploadOutlined, FileImageOutlined, VideoCameraOutlined, InfoCircleOutlined } from "@ant-design/icons";
import PostService from "../../Services/PostService";
import UploadFileService from "../../Services/UploadFileService";

const { Title, Text } = Typography;
const uploader = new UploadFileService();

const CreatePostModal = ({ visible, onCancel }) => {
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
        mediaType: fileType,
      };
      await PostService.createPost(body);
      message.success("Recipe shared successfully");
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
        const url = await uploader.uploadFile(info.fileList[0].originFileObj, "posts");
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

  const MediaPreview = () => {
    if (!image) return null;
    
    if (fileType === "image") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <img src={image} alt="Recipe Preview" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: 12 }} />
        </div>
      );
    }
    
    if (fileType === "video") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <video controls src={image} style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: 12 }} />
        </div>
      );
    }
    
    return null;
  };

  return (
    <Modal
      title={<Title level={4}>Share Your Recipe</Title>}
      onCancel={onCancel} // Close the modal when onCancel is triggered
      footer={null}
      visible={visible} // Modal visibility controlled via prop
      width={600}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="contentDescription"
          label="Describe Your Dish"
          rules={[{ required: true, message: "Please describe your culinary creation" }]}>
          <Input.TextArea rows={4} placeholder="What did you cook? Share the recipe..." />
        </Form.Item>

        <Form.Item
          name="mediaLink"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8 }}>Show Off Your Dish</span>
              <Tooltip title="Upload a photo or video of your delicious creation">
                <InfoCircleOutlined />
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please upload an image or video of your dish" }]}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={image ? (fileType === "image" ? <FileImageOutlined /> : <VideoCameraOutlined />) : <UploadOutlined />} disabled={imageUploading}>
                {imageUploading ? "Uploading..." : image ? `${fileType} Uploaded` : "Upload Dish Photo/Video"}
              </Button>
            </Upload>
          </div>
        </Form.Item>

        {image && <Text type="success">Looks delicious! Ready to share!</Text>}
        
        <MediaPreview />

        <Form.Item style={{ marginBottom: 0, marginTop: 20 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onCancel} style={{ borderRadius: 12 }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={imageUploading || !image} style={{ borderRadius: 12 }}>
              {loading ? "Sharing..." : "Share Recipe"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
