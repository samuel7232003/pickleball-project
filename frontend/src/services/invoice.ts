import { apiInstance } from "./api";

const createInvoiceService = async (userId: string, ownerId: string, timeChoice: any) => {
  const response = await apiInstance.post("/createInvoice", {userId, ownerId, timeChoice});
  return response;
};

const getInvoicePendingService = async (userId: string) => {
  console.log(userId);
  const response = await apiInstance.get(`/getInvoicePending?userId=${userId}`);
  return response;
};

export { createInvoiceService, getInvoicePendingService }; 