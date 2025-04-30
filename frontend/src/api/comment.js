// src/api/comment.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/comments";

export const getCommentsByPostId = async (postId) => {
  return await axios.get(`${BASE_URL}/post/${postId}`);
};

export const addComment = async (commentData) => {
  return await axios.post(BASE_URL, commentData);
};
