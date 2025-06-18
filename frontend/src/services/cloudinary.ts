import axios from 'axios';

export async function uploadCloudinary(file: File): Promise<string> {
  const preset = process.env.REACT_APP_CLOUDINARY_PRESET || "";
  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY || "";

  if (!preset || !cloudinaryUrl) {
    throw new Error("Thiếu cấu hình Cloudinary");
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);

  try {
    const res = await axios.post(cloudinaryUrl, formData);
    return res.data.secure_url;
  } catch (error: any) {
    console.error('Lỗi upload:', error.response?.data || error);
    throw new Error('Không thể xử lý ảnh');
  }
}
