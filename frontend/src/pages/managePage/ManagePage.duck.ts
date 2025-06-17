import { delay } from "../../common/functions";
import { invoiceStatusService } from "../../services/invoice";
import {
  getStatisticsService,
  getCalendarEventsService,
} from "../../services/manage";

interface Statistics {
  totalCourts: number;
  activeBookings: number;
  monthlyRevenue: number;
  totalUsers: number;
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
}

const initialState: ManagePageState = {
  statistics: {
    totalCourts: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
  },
  events: {},
  isLoading: false,
  error: null,
};

// Action Types
export const SET_STATISTICS = "SET_STATISTICS";
export const SET_EVENTS = "SET_EVENTS";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const RESET_STATE = "RESET_STATE";

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
      // Gắn thêm date (YYYY-MM-DD) từ createdAt
      const eventsWithDate = response.map((event: any) => ({
        ...event,
        date: event.createdAt.slice(0, 10), // Cắt "2025-06-17" từ ISO string
      }));

      // Nhóm theo ngày
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

export const initializeManagePage = (id: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  await invoiceStatusService();

  try {
    await delay(500); // Simulate network delay
    await Promise.all([
      dispatch(fetchStatistics(id)),
      dispatch(fetchCalendarEvents(id)),
    ]);
  } catch (error: any) {
    dispatch(setError(error.message || "Failed to initialize manage page"));
  } finally {
    dispatch(setLoading(false));
  }
};

export default managePageReducer;
