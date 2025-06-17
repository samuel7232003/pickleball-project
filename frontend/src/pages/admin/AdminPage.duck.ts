import { getAllCourtService } from '../../services/court';
import { getAllUserService, getAllOwnerService, updateUserProfileService } from '../../services/account';
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

interface AdminState {
  users: User[];
  owners: Owner[];
  courts: Court[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AdminState = {
  users: [],
  owners: [],
  courts: [],
  loading: false,
  error: null,
};

// Action Types
export const SET_USERS = 'SET_USERS';
export const SET_OWNERS = 'SET_OWNERS';
export const SET_COURTS = 'SET_COURTS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const RESET_STATE = 'RESET_STATE';
export const UPDATE_ACCOUNT_STATUS = 'UPDATE_ACCOUNT_STATUS';

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

export const resetState = () => ({
  type: RESET_STATE,
});

export const updateAccountStatus = (accountId: string, isBanned: boolean) => ({
  type: UPDATE_ACCOUNT_STATUS,
  payload: { accountId, isBanned },
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

export const initializeAdminPage = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  
  try {
    await Promise.all([
      dispatch(fetchUsers()),
      dispatch(fetchOwners()),
      dispatch(fetchCourts())
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
    case RESET_STATE:
      return initialState;
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
        ),
      };
    default:
      return state;
  }
};

// Selectors
export const selectUsers = (state: { adminPage: AdminState }) => state.adminPage.users;
export const selectOwners = (state: { adminPage: AdminState }) => state.adminPage.owners;
export const selectCourts = (state: { adminPage: AdminState }) => state.adminPage.courts;
export const selectLoading = (state: { adminPage: AdminState }) => state.adminPage.loading;
export const selectError = (state: { adminPage: AdminState }) => state.adminPage.error;

export default adminPageReducer; 