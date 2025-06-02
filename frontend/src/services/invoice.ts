import { apiInstance } from "./api";
import { InvoiceHistory } from '../pages/personal/PersonalPage.duck';

const createInvoiceService = async (userId: string, ownerId: string, timeChoice: any) => {
  const response = await apiInstance.post("/createInvoice", {userId, ownerId, timeChoice});
  return response;
};

const getInvoicePendingService = async (userId: string) => {
  const response: any = await apiInstance.get(`/getInvoicePending?userId=${userId}`);
  const {invoice, timeslot, court} = response;
  if(!invoice || !timeslot || !court) {
    return null;
  }
  return {invoice, timeslot, court};
};

export const getInvoiceHistoryService = async (userId: string): Promise<InvoiceHistory[]> => {
  // TODO: Replace with actual API call
  const response = await fetch(`/api/users/${userId}/invoices`);
  if (!response.ok) {
    throw new Error('Failed to fetch invoice history');
  }
  return response.json();
};

export { createInvoiceService, getInvoicePendingService }; 