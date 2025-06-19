import { apiInstance } from "./api";

// Request status types
export const REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVE: "APPROVE",
  DENINE: "DENINE",
} as const;

export type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

// Request interface
export interface Request {
  _id?: string;
  ownerId: string;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  amount: number;
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create request
export const createRequestService = async (requestData: Omit<Request, 'status' | '_id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await apiInstance.post('/createRequest', requestData);
    return response;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

// Get requests with optional filtering
export const getRequestsService = async (filters?: { ownerId?: string; status?: RequestStatus }) => {
  try {
    const params = new URLSearchParams();
    if (filters?.ownerId) params.append('ownerId', filters.ownerId);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await apiInstance.get(`/getRequests?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error getting requests:', error);
    throw error;
  }
};

// Update request
export const updateRequestService = async (requestId: string, updateData: Partial<Request>) => {
  try {
    const response = await apiInstance.put(`/updateRequest/${requestId}`, updateData);
    return response;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};

// Helper function to update request status
export const updateRequestStatusService = async (requestId: string, status: RequestStatus) => {
  return await updateRequestService(requestId, { status });
};

// Helper function to approve a request
export const approveRequestService = async (requestId: string) => {
  return await updateRequestStatusService(requestId, REQUEST_STATUS.APPROVE);
};

// Helper function to deny a request
export const denyRequestService = async (requestId: string) => {
  return await updateRequestStatusService(requestId, REQUEST_STATUS.DENINE);
};
