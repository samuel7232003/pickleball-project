import { delay } from "../../common/functions";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { createCourtService } from "../../services/court";
import text from "../../util/text";

const initialState = {
  name: "",
  location: "",
  lat: 0,
  lng: 0,
  images: [],
  description: "",
  number: 1,
  listTimeslot: [],
  isSubmitting: false,
  errorMessage: "",
  isDisabled: false,
  successMessage: "",
  isSuccess: false,
};

export const ON_CHANGE_NAME = "ON_CHANGE_NAME";
export const ON_CHANGE_LOCATION = "ON_CHANGE_LOCATION";
export const ON_CHANGE_DESCRIPTION = "ON_CHANGE_DESCRIPTION";
export const ON_CHANGE_LIST_TIMESLOT = "ON_CHANGE_LIST_TIMESLOT";
export const ON_CHANGE_NUMBER = "ON_CHANGE_NUMBER";
export const ON_CHANGE_IMAGES = "ON_CHANGE_IMAGES";
export const ON_SUBMIT_REQUEST = "ON_SUBMIT_REQUEST";
export const ON_SUBMIT_SUCCESS = "ON_SUBMIT_SUCCESS";
export const ON_SUBMIT_FAILURE = "ON_SUBMIT_FAILURE";
export const ON_RESET_STATE = "ON_RESET_STATE";
export const ON_CHANGE_DISABLED = "ON_CHANGE_DISABLED";

export default function createCourtReducer(state = initialState, action: any) {
  switch (action.type) {
    case ON_CHANGE_NAME: {
      return { ...state, name: action.payload };
    }
    case ON_CHANGE_LOCATION: {
      return { ...state, location: action.payload.address, lat: action.payload.lat, lng: action.payload.lng };
    }
    case ON_CHANGE_DESCRIPTION: {
      return { ...state, description: action.payload };
    }
    case ON_CHANGE_LIST_TIMESLOT: {
      return { ...state, listTimeslot: action.payload };
    }
    case ON_CHANGE_NUMBER: {
      return { ...state, number: action.payload };
    }
    case ON_CHANGE_IMAGES: {
      return { ...state, images: action.payload };
    }
    case ON_SUBMIT_REQUEST: {
      return { ...state, isSubmitting: true };
    }
    case ON_SUBMIT_SUCCESS: {
      return { ...state, isSubmitting: false, successMessage: action.payload, isSuccess: true };
    }
    case ON_SUBMIT_FAILURE: {
      return { ...state, isSubmitting: false, errorMessage: action.payload };
    }
    case ON_RESET_STATE: {
      return initialState;
    }
    case ON_CHANGE_DISABLED: {
      return { ...state, isDisabled: action.payload };
    }
    default:
      return state;
  }
}

export const onChangeField = (type: string, value: any) => ({
  type: type,
  payload: value,
});

export const onChangeListTimeslot = (listTimeslot: any[]) => ({
  type: ON_CHANGE_LIST_TIMESLOT,
  payload: listTimeslot,
});

export const onChangeImages = (images: any[]) => ({
  type: ON_CHANGE_IMAGES,
  payload: images,
});

export const onSubmitRequest = () => ({
  type: ON_SUBMIT_REQUEST,
});

export const onSubmitSuccess = (successMessage: string) => ({
  type: ON_SUBMIT_SUCCESS,
  payload: successMessage,
});

export const onSubmitFailure = (errorMessage: string) => ({
  type: ON_SUBMIT_FAILURE,
  payload: errorMessage,
});

export const onResetState = () => ({
  type: ON_RESET_STATE,
});

export const onChangeDisabled = (isDisabled: boolean) => ({
  type: ON_CHANGE_DISABLED,
  payload: isDisabled,
});

export const handleSubmit = (ownerId: string) => async(dispatch: any, getState: any) => {
    dispatch(onSubmitRequest());
    const { name, location, lat, lng, description, number, images, listTimeslot } = getState().createCourt;
    if(!name || !location || !lat || !lng || !description || !number || !images || !listTimeslot) {
      dispatch(onSubmitFailure(text["CreateCourt.errorNotEnough"]));
      return;
    }
    const courtData = { name, location, lat, lng, description, number, images, listTimeslot };
    try {
      const response = await createCourtService(courtData, ownerId);
      if (response) {
        dispatch(onSubmitSuccess(text["CreateCourt.successCreateCourt"]));
        await delay(1000);
        dispatch(onResetState());
      } else {
        dispatch(onSubmitFailure(text["CreateCourt.errorCreateCourt"]));
      }
    } catch (error) {
      dispatch(onSubmitFailure(text["CreateCourt.errorCreateCourt"]));
    }
  }