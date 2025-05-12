import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";

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

const uploader = new UploadFileService();
const UploadPostModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const selectedPost = snap.selectedPost;
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setImage(selectedPost?.mediaLink);
    setFileType(selectedPost.mediaType);
    form.setFieldsValue({
      contentDescription: selectedPost?.contentDescription,
    });
  }, [snap.selectedPost]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const body = {
        contentDescription: values.contentDescription,
        mediaLink: image,
        mediaType: fileType,
      };
      await PostService.updatePost(selectedPost.id, body);
      state.posts = await PostService.getPosts();
      state.updatePostModalOpened = false; // Close the modal after update
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const fileType = info.file.type.split("/")[0];
      setFileType(fileType);
      const url = await uploader.uploadFile(
        info.fileList[0].originFileObj,
        "posts"
      );
      setImage(url);
    } else if (info.file.status === "removed") {
    }
    setImageUploading(false);
  };

  return (
    <Modal
      open={snap.updatePostModalOpened}
      onCancel={() => {
        state.updatePostModalOpened = false;
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => (state.updatePostModalOpened = false)}
          style={{ borderRadius: 8, borderColor: themeColors.primary, }}
        >
          Cancel
        </Button>,
        <Button
          disabled={imageUploading}
          key="update"
          type="primary"
          loading={loading}
          onClick={form.submit}
          style={{
            background: themeColors.primary,
            borderColor: themeColors.primary,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)"
          }}
        >
          Update
        </Button>,
      ]}
    >
      <h1>Update Post</h1>
      <Form
        form={form}
        initialValues={{ contentDescription: selectedPost.contentDescription }}
        onFinish={handleUpdate}
      >
        <Form.Item
          name="contentDescription"
          label="Content Description"
          rules={[
            { required: true, message: "Please enter content description" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        {!imageUploading && (
          <Form.Item
            name="mediaLink"
            label="Media Link"
            rules={[{ required: true, message: "Please enter media link" }]}
          >
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginBottom: "1rem" }}
            >
              <Button icon={<UploadOutlined />}>Upload Media</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
      {imageUploading && <p>Please wait media is uploading</p>}
      {fileType === "image" && (
        <img src={image} style={{ maxHeight: 400 }} alt="Post" />
      )}
      {fileType === "video" && (
        <video controls src={image} style={{ maxHeight: 400, width: "100%" }} />
      )}
      <div style={{ height: 16 }} />
    </Modal>
  );
};

export default UploadPostModal;
