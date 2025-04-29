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
      title={<div style={{ textAlign: "center", fontSize: "18px"}}>Share Your Recipe</div>}
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

        <div style={{ padding: "20px", backgroundColor: "#ff5e001b", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ padding: "20px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>

        <Form.Item
          name="contentDescription"
          label={<div style={{ fontWeight: "500"}}>Describe Your Dish</div>}
          rules={[{ required: true, message: "Please describe your dish" }]}>
          <Input.TextArea
            rows={4}
            placeholder="Share your recipe, ingredients, or cooking method..."
          />
        </Form.Item>

        <div style={{ padding: "20px", backgroundColor: "#ff5e001b", borderRadius: "8px", border: "2px dashed rgba(255, 94, 0, 0.61)",  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>


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
        </div>
        </div> 
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#ff5e00ac",
              marginTop: "18px",
              height: "40px",
              color: "#ffffff",
              fontWeight: "500",
              fontSize: "15px"
              }}
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
