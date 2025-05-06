import axios from "axios";
import { BASE_URL } from "../constants";
import NotificationService from "./NotificationService";

class LikeService {
  async getLikesByPostId(postId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/likes/${postId}`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get likes by post ID");
    }
  }

  

  async deleteLike(likeId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${BASE_URL}/likes/${likeId}`, config);
    } catch (error) {
      throw new Error("Failed to delete like");
    }
  }
}

export default new LikeService();
