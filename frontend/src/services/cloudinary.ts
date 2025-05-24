import axios from 'axios';

export async function uploadCloudinary(file: File): Promise<string> {
  const preset = process.env.REACT_APP_CLOUDINARY_PRESET || "";
  const cloudinary_url = process.env.REACT_APP_CLOUDINARY || "";
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset );
  try {
    const res = await axios.post(cloudinary_url, formData);
    return res.data.secure_url;
  } catch (error) {
    console.error('Lỗi upload hoặc phân tích ảnh:', error);
    throw new Error('Không thể xử lý ảnh');
  }
}