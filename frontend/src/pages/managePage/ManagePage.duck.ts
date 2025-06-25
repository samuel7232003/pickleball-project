import {
  getStatisticsService,
  getCalendarEventsService,
} from "../../services/manage";
import { createRequestService, getRequestsService, Request } from "../../services/request";
import { getListCourtServiceForOwner, getStatusTimeslotService, getTimeslotByCourtIdService } from "../../services/court";
import dayjs from "dayjs";
import { createInvoiceService, updateInvoiceService } from '../../services/invoice';

interface Court {
  _id: string;
  name: string;
  location: string;
  images: { url: string; order: number }[];
  number: number;
  timeslot: any[];
}

interface Statistics {
  totalCourts: number;
  activeBookings: number;
  monthlyRevenue: number;
  totalUsers: number;
  totalPayout: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
  amount: number;
  courtName: string;
  userName: string;
}

interface ManagePageState {
  statistics: Statistics;
  events: { [key: string]: Event[] };
  isLoading: boolean;
  error: string | null;
  isCreatingRequest: boolean;
  requestError: string | null;
  requests: Request[];
  isLoadingRequests: boolean;
  requestsError: string | null;
  courts: Court[];
  isLoadingCourts: boolean;
  courtsError: string | null;
  timeslot: any[];
  timeslotStatus: any[];
  selectedCourtId: string | null;
  selectedDate: string | null;
  numberCourt: number;
}

const initialState: ManagePageState = {
  statistics: {
    totalCourts: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    totalPayout: 0,
  },
  events: {},
  isLoading: false,
  error: null,
  isCreatingRequest: false,
  requestError: null,
  requests: [],
  isLoadingRequests: false,
  requestsError: null,
  courts: [],
  isLoadingCourts: false,
  courtsError: null,
  timeslot: [],
  numberCourt: 0,
  selectedCourtId: null,
  selectedDate: dayjs(new Date()).format("DD-MM-YYYY"),
  timeslotStatus: [],
};

// Action Types
export const SET_STATISTICS = "SET_STATISTICS";
export const SET_EVENTS = "SET_EVENTS";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const RESET_STATE = "RESET_STATE";
export const SET_CREATING_REQUEST = "SET_CREATING_REQUEST";
export const SET_REQUEST_ERROR = "SET_REQUEST_ERROR";
export const SET_REQUESTS = "SET_REQUESTS";
export const SET_LOADING_REQUESTS = "SET_LOADING_REQUESTS";
export const SET_REQUESTS_ERROR = "SET_REQUESTS_ERROR";
export const SET_COURTS = "SET_COURTS";
export const SET_LOADING_COURTS = "SET_LOADING_COURTS";
export const SET_COURTS_ERROR = "SET_COURTS_ERROR";
export const SET_SELECTED_COURT_ID = "SET_SELECTED_COURT_ID";
export const SET_SELECTED_DATE = "SET_SELECTED_DATE";
export const SET_TIMESLOT = "SET_TIMESLOT";
export const SET_NUMBER_COURT = "SET_NUMBER_COURT";
export const SET_TIMESLOT_STATUS = "SET_TIMESLOT_STATUS";

// Action Creators
export const setStatistics = (statistics: Statistics) => ({
  type: SET_STATISTICS,
  payload: statistics,
});

export const setEvents = (events: { [key: string]: Event[] }) => ({
  type: SET_EVENTS,
  payload: events,
});

export const setLoading = (isLoading: boolean) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const setCreatingRequest = (isCreating: boolean) => ({
  type: SET_CREATING_REQUEST,
  payload: isCreating,
});

export const setRequestError = (error: string | null) => ({
  type: SET_REQUEST_ERROR,
  payload: error,
});

export const setRequests = (requests: Request[]) => ({
  type: SET_REQUESTS,
  payload: requests,
});

export const setLoadingRequests = (isLoading: boolean) => ({
  type: SET_LOADING_REQUESTS,
  payload: isLoading,
});

export const setRequestsError = (error: string | null) => ({
  type: SET_REQUESTS_ERROR,
  payload: error,
});

export const setCourts = (courts: Court[]) => ({
  type: SET_COURTS,
  payload: courts,
});

export const setLoadingCourts = (isLoading: boolean) => ({
  type: SET_LOADING_COURTS,
  payload: isLoading,
});

export const setCourtsError = (error: string | null) => ({
  type: SET_COURTS_ERROR,
  payload: error,
});

export const setSelectedCourtId = (courtId: string | null) => ({
  type: SET_SELECTED_COURT_ID,
  payload: courtId,
});

export const setSelectedDate = (date: string | null) => ({
  type: SET_SELECTED_DATE,
  payload: date,
});

export const setTimeslot = (timeslot: any[]) => ({
  type: SET_TIMESLOT,
  payload: timeslot,
});

export const setNumberCourt = (numberCourt: number) => ({
  type: SET_NUMBER_COURT,
  payload: numberCourt,
});

export const setTimeslotStatus = (timeslotStatus: any[]) => ({
  type: SET_TIMESLOT_STATUS,
  payload: timeslotStatus,
});

export const resetState = () => ({
  type: RESET_STATE,
});

// Reducer
export const managePageReducer = (
  state = initialState,
  action: any
): ManagePageState => {
  switch (action.type) {
    case SET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SET_CREATING_REQUEST:
      return {
        ...state,
        isCreatingRequest: action.payload,
      };
    case SET_REQUEST_ERROR:
      return {
        ...state,
        requestError: action.payload,
      };
    case SET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
      };
    case SET_LOADING_REQUESTS:
      return {
        ...state,
        isLoadingRequests: action.payload,
      };
    case SET_REQUESTS_ERROR:
      return {
        ...state,
        requestsError: action.payload,
      };
    case SET_COURTS:
      return {
        ...state,
        courts: action.payload,
      };
    case SET_LOADING_COURTS:
      return {
        ...state,
        isLoadingCourts: action.payload,
      };
    case SET_COURTS_ERROR:
      return {
        ...state,
        courtsError: action.payload,
      };
    case SET_SELECTED_COURT_ID:
      return {
        ...state,
        selectedCourtId: action.payload,
      };
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
      };
    case SET_TIMESLOT:
      return {
        ...state,
        timeslot: action.payload,
      };
    case SET_NUMBER_COURT:
      return {
        ...state,
        numberCourt: action.payload,
      };
    case SET_TIMESLOT_STATUS:
      return {
        ...state,
        timeslotStatus: action.payload,
      };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// Thunk Actions
export const fetchStatistics = (id: string) => async (dispatch: any) => {
  try {
    const response: any = await getStatisticsService(id);
    if (response) {
      dispatch(setStatistics(response));
    }
  } catch (error: any) {
    dispatch(setError(error.message || "Failed to fetch statistics"));
  }
};

export const fetchCalendarEvents = (id: string) => async (dispatch: any) => {
  try {
    const response: any = await getCalendarEventsService(id);

    if (response && Array.isArray(response)) {
      const eventsWithDate = response.map((event: any) => ({
        ...event,
        date: event.createdAt.slice(0, 10),
      }));

      const eventsByDate = eventsWithDate.reduce((acc: { [key: string]: Event[] }, event: any) => {
        if (!acc[event.date]) {
          acc[event.date] = [];
        }
        acc[event.date].push(event);
        return acc;
      }, {});

      dispatch(setEvents(eventsByDate));
    }
  } catch (error: any) {
    dispatch(setError(error.message || "Failed to fetch calendar events"));
  }
};

export const fetchCourtsByOwner = (ownerId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoadingCourts(true));
    dispatch(setCourtsError(null));
    const response = await getListCourtServiceForOwner(ownerId);
    if (response) {
      dispatch(setCourts(response));
    }
  } catch (error: any) {
    dispatch(setCourtsError(error.message || "Failed to fetch courts"));
  } finally {
    dispatch(setLoadingCourts(false));
  }
}

export const fetchRequests = (ownerId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoadingRequests(true));
    dispatch(setRequestsError(null));
    
    const response = await getRequestsService({ ownerId });
    const requests = Array.isArray(response) ? response : (response?.data || []);
    dispatch(setRequests(requests));
  } catch (error: any) {
    const errorMessage = error.message || "Failed to fetch requests";
    dispatch(setRequestsError(errorMessage));
  } finally {
    dispatch(setLoadingRequests(false));
  }
};

export const createRequest = (requestData: Omit<Request, 'status' | '_id' | 'createdAt' | 'updatedAt'>, ownerId: string) => async (dispatch: any) => {
  try {
    dispatch(setCreatingRequest(true));
    dispatch(setRequestError(null));
    
    const response = await createRequestService({
      ...requestData,
      ownerId,
    });
    
    dispatch(fetchRequests(ownerId));
    
    return response;
  } catch (error: any) {
    const errorMessage = error.message || "Failed to create request";
    dispatch(setRequestError(errorMessage));
    throw new Error(errorMessage);
  } finally {
    dispatch(setCreatingRequest(false));
  }
};

export const initializeManagePage = (id: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await Promise.all([
      dispatch(fetchStatistics(id)),
      dispatch(fetchCalendarEvents(id)),
      dispatch(fetchRequests(id)),
      dispatch(fetchCourtsByOwner(id)),
    ]);
  } catch (error: any) {
    dispatch(setError(error.message || "Failed to initialize manage page"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTimeslotStatus = (courtId: string) => async (dispatch: any, getState:any ) => {
  const { selectedDate, courts } = getState().managePage;
  const timeslots = await getTimeslotByCourtIdService(courtId);
  const court = courts.find((court: any) => court._id === courtId);
  dispatch(setNumberCourt(court.number));
  if(timeslots.length > 0){
    // Fetch timeslot status for each court number from 1 to court.number
    let timeslotStatusWithCourtNumber: any[] = [];
    for (let i = 1; i <= court.number; i++) {
      const statusArr = await getStatusTimeslotService(courtId, selectedDate, i.toString());
      const statusWithCourtNumber = statusArr.map((status: any) => ({
        ...status,
        courtNumber: i,
      }));
      timeslotStatusWithCourtNumber = timeslotStatusWithCourtNumber.concat(statusWithCourtNumber);
    }
    dispatch(setTimeslotStatus(timeslotStatusWithCourtNumber));
    dispatch(setTimeslot(timeslots));
  }
};

export const markCourtUnavailable = ({ date, courtId, startTime, endTime, courtNumber }: { date: string, courtId: string, startTime: string, endTime: string, courtNumber: number }) => async (dispatch: any, getState: any) => {
  try {
    // Get userId and ownerId from state if available
    const state = getState();
    const userId = state.user?.user?._id || 'admin';
    const ownerId = state.user?.user?._id || 'admin';
    // Compose timeChoice for invoice
    const timeChoice = [{ _id: `${courtId}_${startTime}_${endTime}_${courtNumber}`, dateChoiced: date, numberChoie: courtNumber }];
    // 1. Create invoice with amount=0
    const invoiceRes: any = await createInvoiceService(userId, ownerId, timeChoice, 0, courtId);

    const invoiceId = invoiceRes._id || invoiceRes.invoice?._id;
    // 2. Update invoice status to 'paid'
    if (invoiceId) {
      await updateInvoiceService(invoiceId, 'paid');
      console.log('update invoice success');
    }
    // 3. Refetch timeslot status for the court
    await dispatch(fetchTimeslotStatus(courtId));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default managePageReducer;
