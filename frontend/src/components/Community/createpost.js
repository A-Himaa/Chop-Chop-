import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Modal } from "antd";
import { UploadOutlined, FileImageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import UploadFileService from "../../services/UploadFileService";
import PostService from "../../services/PostService";
import { useSnapshot } from "valtio";
import state from "../../Utils/store";

const uploader = new UploadFileService();

const CreatePost = () => {
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
      state.createPostModalOpened = false; // Close the modal after post creation
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
        const type = info.file.type.split("/")[0];
        setFileType(type);
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "posts"
        );
        setImage(url);
        form.setFieldsValue({ mediaLink: url });
        message.success(`${type} uploaded successfully`);
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

  return (
    <Modal
      title="Share Your Recipe"
      visible={snap.createPostModalOpened} // Control modal visibility from state
      onCancel={() => state.createPostModalOpened = false} // Close modal
      footer={null}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        style={{ maxWidth: 600, margin: "0 auto", padding: "24px" }}
      >
        <Form.Item
          name="contentDescription"
          label="Describe Your Dish"
          rules={[{ required: true, message: "Please describe your dish" }]}>
          <Input.TextArea
            rows={4}
            placeholder="Share your recipe, ingredients, or cooking method..."
          />
        </Form.Item>

        <Form.Item
          name="mediaLink"
          label="Upload Photo/Video"
          rules={[{ required: true, message: "Please upload an image or video" }]}>
          <Upload
            accept="image/*,video/*"
            onChange={handleFileChange}
            showUploadList={false}
            beforeUpload={() => false}
            maxCount={1}>
            <Button
              icon={image ? (fileType === "image" ? <FileImageOutlined /> : <VideoCameraOutlined />) : <UploadOutlined />}
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : image ? "File Uploaded" : "Upload"}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={imageUploading || !image}
            block
          >
            {loading ? "Sharing..." : "Share Recipe"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePost;
