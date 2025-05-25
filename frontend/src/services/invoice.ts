import { apiInstance } from "./api";

const createInvoiceService = async (userId: string, ownerId: string, timeChoice: any) => {
  const response = await apiInstance.post("/createInvoice", {userId, ownerId, timeChoice});
  return response;
};

export { createInvoiceService };