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
  return response;
}

export const getImageCourtService = async (courtId: string) => {
  const response: any = await apiInstance.get(`/getImageCourt?courtId=${courtId}`);
  return response;
}

export const updateCourtService = async (courtId: string, courtData: any) => {
  const {images, listTimeslot, ...rest} = courtData;
  const uploadedUrls = await Promise.all(
    images.map(async (img: any) => {
      if (img.url.startsWith('http')) {
        return img;
      }
      const file = await fetch(img.url).then(res => res.blob());
      const uploadedUrl = await uploadCloudinary(file as File);
      return {
        url: uploadedUrl,
        order: img.order,
      };
    })
  );
  const response: any = await apiInstance.put(`/updateCourt/${courtId}`, {
    ...rest,
    images: uploadedUrls,
    listTimeslot,
  });
  
  return response;
};

export const getStatusTimeslotService = async (courtId: string, date: string, num: string) => {
  const response: any = await apiInstance.get(`/getTimeslot?court_id=${courtId}&date=${date}&num=${num}`);
  if(response.length === 0) {
    return [];
  }
  return response;
}

export const getCourtService = async (courtId: string) => {
  const response: any = await apiInstance.get(`/getCourt?_id=${courtId}`);
  return response;
}

export const getListCourtServiceForOwner = async (userId: string) => {
  const response: any = await apiInstance.get(`/getListCourt?ownerId=${userId}`);
  return response;
}

export const getTimeslotByCourtIdService = async (courtId: string) => {
  const response: any = await apiInstance.get(`/getTimeslotByCourtId?courtId=${courtId}`);
  return response;
}

export const updateTimeslotOfCourtService = async (courtId: string, timeslots: any) => {
  const response: any = await apiInstance.post(`/updateTimeslotOfCourt`, { courtId, timeslots });
  return response;
}