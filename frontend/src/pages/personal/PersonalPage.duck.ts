import { getInvoiceHistoryService } from "../../services/invoice";
import { delay } from "../../common/functions";
import {
  getUserProfileService,
  updateUserProfileService,
} from "../../services/account";
import { uploadCloudinary } from "../../services/cloudinary";
import text from "../../util/text";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  username: string;
  password: string;
}

export interface InvoiceHistory {
  id: string;
  courtName: string;
  address: string;
  sessions: number;
  price: number;
  status: "pending" | "completed";
  date: string;
}

const initialState = {
  userProfile: {},
  invoiceHistory: [],
  isLoading: false,
  error: null,
  isEditMode: false,
  successMessage: "",
};

// Action Types
export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const SET_INVOICE_HISTORY = "SET_INVOICE_HISTORY";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SET_EDIT_MODE = "SET_EDIT_MODE";
export const RESET_STATE = "RESET_STATE";
export const UPDATE_USER_PROFILE_AVATAR = "UPDATE_USER_PROFILE_AVATAR";

// Reducer
export const personalPageReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload.profile,
        successMessage: action.payload.successMessage,
      };
    case SET_INVOICE_HISTORY:
      return { ...state, invoiceHistory: action.payload };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_EDIT_MODE:
      return { ...state, isEditMode: action.payload };
    case RESET_STATE:
      return initialState;
    case UPDATE_USER_PROFILE_AVATAR:
      return {
        ...state,
        userProfile: { ...state.userProfile, avatar: action.payload.avatar },
        successMessage: action.payload.successMessage,
      };
    default:
      return state;
  }
};

// Action Creators
export const setUserProfile = (
  profile: UserProfile,
  successMessage: string
) => ({
  type: SET_USER_PROFILE,
  payload: { profile, successMessage },
});

export const setInvoiceHistory = (history: InvoiceHistory[]) => ({
  type: SET_INVOICE_HISTORY,
  payload: history,
});

export const setLoading = (isLoading: boolean) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const setEditMode = (isEditMode: boolean) => ({
  type: SET_EDIT_MODE,
  payload: isEditMode,
});

export const resetState = () => ({
  type: RESET_STATE,
});

// Thunk Actions
export const fetchUserProfile = (userId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    await delay(500); // Simulate network delay
    const response = await getUserProfileService(userId);

    if (response) {
      dispatch(setUserProfile(response, ""));
    }
  } catch (error: any) {
    dispatch(setError(error.message || "Failed to fetch user profile"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchInvoiceHistory =
  (userId: string) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await delay(500); // Simulate network delay
      const response = await getInvoiceHistoryService(userId);

      if (response) {
        dispatch(setInvoiceHistory(response));
      }
    } catch (error: any) {
      dispatch(setError(error.message || "Failed to fetch invoice history"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const initializePersonalPage =
  (userId: string, currentUserId: string) => async (dispatch: any) => {
    dispatch(setEditMode(userId === currentUserId));
    await Promise.all([
      dispatch(fetchUserProfile(userId)),
      dispatch(fetchInvoiceHistory(userId)),
    ]);
  };

export const updateUserProfileAvatar =
  (avatar: any) => async (dispatch: any, getState: any) => {
    const { _id: id } = getState().personalPage.userProfile;
    try {
      const file = await fetch(avatar).then((res) => res.blob());
      const avaterUrl = await uploadCloudinary(file as File);
      const response = await updateUserProfileService(id, {
        avatar: avaterUrl,
      });
      if (response) {
        dispatch(
          updateUserProfileAvatar({
            avatar: avaterUrl,
            successMessage: text["PersonalPage.successUpdateAvatar"],
          })
        );
      }
    } catch (error: any) {
      dispatch(setError(text["PersonalPage.errorUpdateAvatar"]));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateUserProfile =
  (id: string, data: any) => async (dispatch: any) => {
    try {
      const response = await updateUserProfileService(id, data);
      if (response) {
        dispatch(setUserProfile(response, text["PersonalPage.successUpdate"]));
      }
    } catch (error: any) {
      dispatch(setError(text["PersonalPage.errorUpdate"]));
    } finally {
      dispatch(setLoading(false));
    }
  };

export default personalPageReducer;
