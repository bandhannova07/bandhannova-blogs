import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an image or video to Cloudinary
 * @param file The file to upload (base64, local path, or remote URL)
 * @param folder The folder to upload to (defaults to 'bandhannova-blogs')
 */
export async function uploadAsset(file: string, folder: string = 'bandhannova-blogs') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto', // Automatically detect if it's image or video
    });
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}

/**
 * Delete an asset from Cloudinary
 * @param publicId The public ID of the asset
 */
export async function deleteAsset(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw error;
  }
}

export default cloudinary;
