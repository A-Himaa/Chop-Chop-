import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

class UploadFileService {
  // Async method to upload file to Firebase Storage
  async uploadFile(file, path) {
    console.log("uploadFile method triggered");
    try {
      // Creating a reference to the storage location
      const fileRef = ref(storage, `${path}/${file.name}`);

      const uploadTask = uploadBytesResumable(fileRef, file);
      console.log("Upload started!");


      // Returning a promise that resolves to the download URL after upload completion
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },

          (err) => {
            reject(new Error(`Upload failed: ${err.message}`));
          },

          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              reject(new Error(`Failed to get download URL: ${error.message}`));
            }
          }
        );
      });
    } catch (error) {
      // Catching any other unexpected errors
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
}

export default UploadFileService;
