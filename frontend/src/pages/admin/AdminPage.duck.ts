import { getAllCourtService } from '../../services/court';
import { getAllUserService, getAllOwnerService, updateUserProfileService } from '../../services/account';
import { getRequestsService, updateRequestService, REQUEST_STATUS, Request, RequestStatus } from '../../services/request';
import { delay } from "../../common/functions";
import { roles } from '../../common/constants';

// Types
export interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: string;
  isBanned?: boolean;
}

export interface Owner extends User {
  courtCount: number;
}

export interface Court {
  _id: string;
  name: string;
  location: string;
  owner: {
    _id: string;
    first_name: string;
    last_name: string;
  };
}

export interface RequestWithOwner extends Request {
  ownerName?: string;
}

interface AdminState {
  users: User[];
  owners: Owner[];
  courts: Court[];
  requests: RequestWithOwner[];
  loading: boolean;
  error: string | null;
  isLoadingRequests: boolean;
  requestsError: string | null;
}

// Initial State
const initialState: AdminState = {
  users: [],
  owners: [],
  courts: [],
  requests: [],
  loading: false,
  error: null,
  isLoadingRequests: false,
  requestsError: null,
};

// Action Types
export const SET_USERS = 'SET_USERS';
export const SET_OWNERS = 'SET_OWNERS';
export const SET_COURTS = 'SET_COURTS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const RESET_STATE = 'RESET_STATE';
export const UPDATE_ACCOUNT_STATUS = 'UPDATE_ACCOUNT_STATUS';
export const SET_REQUESTS = 'SET_REQUESTS';
export const SET_LOADING_REQUESTS = 'SET_LOADING_REQUESTS';
export const SET_REQUESTS_ERROR = 'SET_REQUESTS_ERROR';
export const UPDATE_REQUEST_STATUS = 'UPDATE_REQUEST_STATUS';

// Action Creators
export const setUsers = (users: User[]) => ({
  type: SET_USERS,
  payload: users,
});

export const setOwners = (owners: Owner[]) => ({
  type: SET_OWNERS,
  payload: owners,
});

export const setCourts = (courts: Court[]) => ({
  type: SET_COURTS,
  payload: courts,
});

export const setLoading = (isLoading: boolean) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const setRequests = (requests: RequestWithOwner[]) => ({
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

export const resetState = () => ({
  type: RESET_STATE,
});

export const updateAccountStatus = (accountId: string, isBanned: boolean) => ({
  type: UPDATE_ACCOUNT_STATUS,
  payload: { accountId, isBanned },
});

export const updateRequestStatus = (requestId: string, status: RequestStatus) => ({
  type: UPDATE_REQUEST_STATUS,
  payload: { requestId, status },
});

// Thunk Actions
export const fetchUsers = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    await delay(500);
    const response = await getAllUserService();

    if (response) {
      const users = response.filter((user: User) => user.role === roles.USER);
      dispatch(setUsers(users));
    }
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to fetch users'));
  }
};

export const fetchOwners = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    await delay(500);
    const response = await getAllOwnerService();

    if (response) {
      const courtsResponse = await getAllCourtService();
      const courts = courtsResponse || [];
      
      const ownersWithCourtCount = response.map((owner: User) => ({
        ...owner,
        courtCount: courts.filter((court: Court) => court.owner?._id === owner._id).length
      }));

      dispatch(setOwners(ownersWithCourtCount));
    }
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to fetch owners'));
  }
};

export const fetchCourts = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    await delay(500);
    const response = await getAllCourtService();

    if (response) {
      const courtsData = response.map((court: any) => ({
        _id: court._id,
        name: court.name,
        location: court.location,
        owner: court.owner || { first_name: 'Unknown', last_name: '' }
      }));
      dispatch(setCourts(courtsData));
    }
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to fetch courts'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchRequests = () => async (dispatch: any) => {
  try {
    dispatch(setLoadingRequests(true));
    dispatch(setRequestsError(null));

    const response = await getRequestsService();
    const requests = Array.isArray(response) ? response : (response?.data || []);
    
    // Get owners to add owner names to requests
    const ownersResponse = await getAllOwnerService();
    const owners = ownersResponse || [];
    
    const requestsWithOwnerNames = requests.map((request: Request) => {
      const owner = owners.find((owner: User) => owner._id === request.ownerId);
      return {
        ...request,
        ownerName: owner ? `${owner.first_name} ${owner.last_name}`.trim() || owner.username : 'Unknown Owner'
      };
    });

    dispatch(setRequests(requestsWithOwnerNames));
  } catch (error: any) {
    const errorMessage = error.message || "Failed to fetch requests";
    dispatch(setRequestsError(errorMessage));
  } finally {
    dispatch(setLoadingRequests(false));
  }
};

export const updateRequestStatusAction = (requestId: string, status: RequestStatus) => async (dispatch: any) => {
  try {
    dispatch(setLoadingRequests(true));
    dispatch(setRequestsError(null));

    await updateRequestService(requestId, { status });
    
    // Update the request status in local state
    dispatch(updateRequestStatus(requestId, status));
    
    // Refresh the requests list
    dispatch(fetchRequests());
    
    // If request was approved, we might want to refresh other data
    // Note: Statistics are per-owner, so we don't need to refresh them here
    // as they're managed on the owner's manage page
  } catch (error: any) {
    const errorMessage = error.message || "Failed to update request status";
    dispatch(setRequestsError(errorMessage));
    throw error;
  } finally {
    dispatch(setLoadingRequests(false));
  }
};

export const initializeAdminPage = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  
  try {
    await Promise.all([
      dispatch(fetchUsers()),
      dispatch(fetchOwners()),
      dispatch(fetchCourts()),
      dispatch(fetchRequests())
    ]);
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to initialize admin page'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const banAccount = (id: string, isCurrentlyBanned: boolean) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await updateUserProfileService(id, { isBanned: !isCurrentlyBanned });
    
    if (response) {
      dispatch(updateAccountStatus(id, !isCurrentlyBanned));
      await dispatch(initializeAdminPage());
    }
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to update account status'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Reducer
export const adminPageReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.payload };
    case SET_OWNERS:
      return { ...state, owners: action.payload };
    case SET_COURTS:
      return { ...state, courts: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_REQUESTS:
      return { ...state, requests: action.payload };
    case SET_LOADING_REQUESTS:
      return { ...state, isLoadingRequests: action.payload };
    case SET_REQUESTS_ERROR:
      return { ...state, requestsError: action.payload };
    case UPDATE_ACCOUNT_STATUS:
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload.accountId 
            ? { ...user, isBanned: action.payload.isBanned }
            : user
        ),
        owners: state.owners.map(owner => 
          owner._id === action.payload.accountId 
            ? { ...owner, isBanned: action.payload.isBanned }
            : owner
        )
      };
    case UPDATE_REQUEST_STATUS:
      return {
        ...state,
        requests: state.requests.map(request => 
          request._id === action.payload.requestId 
            ? { ...request, status: action.payload.status, updatedAt: new Date() }
            : request
        )
      };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// Selectors
export const selectUsers = (state: { adminPage: AdminState }) => state.adminPage.users;
export const selectOwners = (state: { adminPage: AdminState }) => state.adminPage.owners;
export const selectCourts = (state: { adminPage: AdminState }) => state.adminPage.courts;
export const selectRequests = (state: { adminPage: AdminState }) => state.adminPage.requests;
export const selectLoading = (state: { adminPage: AdminState }) => state.adminPage.loading;
export const selectError = (state: { adminPage: AdminState }) => state.adminPage.error;
export const selectLoadingRequests = (state: { adminPage: AdminState }) => state.adminPage.isLoadingRequests;
export const selectRequestsError = (state: { adminPage: AdminState }) => state.adminPage.requestsError;

export default adminPageReducer; 