import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

class UploadFileService {
  async uploadFile(file, path) {
    console.log("uploadFile method triggered");
    try {
      const fileRef = ref(storage, `${path}/${file.name}`);
      console.log("Upload started!");

      // Direct upload (no progress tracking)
      const snapshot = await uploadBytes(fileRef, file);
      console.log("Upload complete!");

      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

export default UploadFileService;
