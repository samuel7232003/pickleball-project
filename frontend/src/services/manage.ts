import { apiInstance } from "./api";

export const getStatisticsService = async (id: string) => {
  const response = await apiInstance.get(`/manage/statistics?_id=${id}`);
  return response;
};

export const getCalendarEventsService = async (id: string) => {
  const response = await apiInstance.get(`/manage/events?_id=${id}`);
  console.log(response);
  return response.data;
}; 