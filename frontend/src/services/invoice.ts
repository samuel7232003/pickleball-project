import { apiInstance } from "./api";
import { getCourtService } from "./court";

export const createInvoiceService = async (userId: string, ownerId: string, timeChoice: any, amount: number, courtId: string) => {
  const response = await apiInstance.post("/createInvoice", {userId, ownerId, timeChoice, amount, courtId});
  return response;
};

export const getInvoicePendingService = async (userId: string, invoiceId: string) => {
  const response: any = await apiInstance.get(`/getInvoicePending?userId=${userId}&invoiceId=${invoiceId}`);
  const {invoice, timeslot, court} = response;
  if(!invoice || !timeslot || !court) {
    return null;
  }
  return {invoice, timeslot, court};
};

export const getInvoiceServiceByIdUser = async (userId: string, role: string) => {
  const response: any[] = await apiInstance.get(`/getInvoiceByIdUser?userId=${userId}&role=${role}`);
  if(response.length === 0) {
    return [];
  }
  const invoice = response.map(async (item: any) => {
    const {_id, courtId, createdAt, paymentStatus, amount} = item;
    const court = await getCourtService(courtId);
    return {invoce: {_id, courtId, createdAt, paymentStatus, amount}, court};
  });

  const result = await Promise.all(invoice);
  return result;
};

export const updateInvoiceService = async (invoiceId: string, status: string) => {
  const response = await apiInstance.post(`/updateInvoice`, {invoiceId, status});
  return response;
};

export const invoiceStatusService = async () => {
  const response = await apiInstance.post(`/checkInvoiceStatus`);
  return response;
};

export const cancelInvoiceService = async (invoiceId: string) => {
  const response = await apiInstance.get(`/cancelInvoice?invoiceId=${invoiceId}`);
  return response;
};