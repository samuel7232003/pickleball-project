import { apiInstance } from "./api";
import { uploadCloudinary } from "./cloudinary";

export const createCourtService = async (courtData: any, ownerId: string) => {
  const {images, ...rest} = courtData;
  const uploadedUrls = await Promise.all(
    images.map(async (img: any) => {
      const file = await fetch(img.url).then(res => res.blob());
      const uploadedUrl = await uploadCloudinary(file as File);
      return {
        url: uploadedUrl,
        order: img.order,
      };
    })
  );
  const response: any = await apiInstance.post(`/createCourt`, {
    ...rest,
    ownerId,
    images: uploadedUrls,
  });
  
  return response;
};

