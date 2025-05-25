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

export const searchCourtsService = async (text: string) => {
  const response: any = await apiInstance.get(`/getCourt?text=${text}`);
  return response;
};

export const getAllCourtService = async () => {
  const response: any = await apiInstance.get(`/getCourt`);
  return response;
}

export const getCourtByIdService = async (id: string) => {
  const response: any = await apiInstance.get(`/getCourt?_id=${id}`);
  const { timeslot, images, _doc } = response;
  return { ..._doc, timeslot, images };
}

export const getImageCourtService = async (courtId: string) => {
  const response: any = await apiInstance.get(`/getImageCourt?courtId=${courtId}`);
  return response;
}
