import axios from "axios";
import { BASE_URL } from "../constants";

class StoryUpdateService {
  async createCookingStory(CookingStoryData) {
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/cookStatusUpdates`,
        CookingStoryData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create Learning Plan story");
    }
  }

  async getWorkoutStoriesByUserId(userId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/cookStatusUpdates/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get Learning Plan stories ");
    }
  }

  async getAllWorkoutStories() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/cookStatusUpdates`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get all Learning Plan stories");
    }
  }

  async deleteCookingStory(updateId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(
        `${BASE_URL}/cookStatusUpdates/${updateId}`,
        config
      );
    } catch (error) {
      throw new Error("Failed to delete Learning Plan story");
    }
  }
  async UpdateStory(updateId, CookingStoryData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.put(
        `${BASE_URL}/cookStatusUpdates/${updateId}`,
        CookingStoryData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update Learning Plan story");
    }
  }
}

export default new StoryUpdateService();
