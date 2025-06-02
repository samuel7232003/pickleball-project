import { delay } from "../../common/functions";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { getCourtByIdService, getStatusTimeslotService } from "../../services/court";
import { createInvoiceService } from "../../services/invoice";
import text from "../../util/text";

const initialState = {
  courtId: "",
  name: "",
  location: "",
  number: "",
  images: [],
  ownerId: "",
  timeslot: [],
  description: "",
  numberChoie: 0,
  timeChoice: [],
  totalPrice: 0,
  dateChoiced: "",
  isLoading: false,
  canSubmit: false,
  errorMessage: "",
  timeslotStatus: [],
};

export const SET_COURT = "SET_COURT";
export const SET_TIMESLOT = "SET_TIMESLOT";
export const SET_TIMESLOT_STATUS = "SET_TIMESLOT_STATUS";
export const SET_NUMBER_CHOICED = "SET_NUMBER_CHOICED";
export const SET_TIME_CHOICED = "SET_TIME_CHOICED";
export const SET_TOTAL_PRICE = "SET_TOTAL_PRICE";
export const SET_DATE_CHOICED = "SET_DATE_CHOICED";
export const SET_CAN_SUBMIT = "SET_CAN_SUBMIT";
export const ON_SUBMIT_REQUEST = "ON_SUBMIT_REQUEST";
export const ON_SUBMIT_SUCCESS = "ON_SUBMIT_SUCCESS";
export const ON_SUBMIT_FAILURE = "ON_SUBMIT_FAILURE";
export const RESET_STATE = "RESET_STATE";

export const detailCourtReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_COURT:
      return { ...state, ...action.payload };
    case SET_NUMBER_CHOICED:
      return { ...state, numberChoie: action.payload };
    case SET_TIME_CHOICED:
      return { ...state, timeChoice: action.payload };
    case SET_TOTAL_PRICE:
      return { ...state, totalPrice: action.payload };
    case SET_DATE_CHOICED:
      return { ...state, dateChoiced: action.payload };
    case ON_SUBMIT_REQUEST:
      return { ...state, isLoading: true, errorMessage: "" };
    case ON_SUBMIT_SUCCESS:
      return { ...state, isLoading: false, errorMessage: "" };
    case ON_SUBMIT_FAILURE:
      return { ...state, isLoading: false, errorMessage: action.payload };
    case SET_CAN_SUBMIT:
      return { ...state, canSubmit: action.payload };
    case SET_TIMESLOT_STATUS:
      return { ...state, timeslotStatus: action.payload };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export const setCourt = (court: any) => {
  return {
    type: SET_COURT,
    payload: court,
  };
};

export const setNumberChoiced = (number: number) => {
  return {
    type: SET_NUMBER_CHOICED,
    payload: number,
  };
};

export const onSubmitRequest = () => {
  return (dispatch: any) => {
    dispatch({
      type: ON_SUBMIT_REQUEST,
    });
  };
};

export const onSubmitSuccess = () => {
  return {
    type: ON_SUBMIT_SUCCESS,
  };
};

export const onSubmitFailure = (errorMessage: string) => {
  return {
    type: ON_SUBMIT_FAILURE,
    payload: errorMessage,
  };
};

export const setCanSubmit = (canSubmit: boolean) => {
  return {
    type: SET_CAN_SUBMIT,
    payload: canSubmit,
  };
};

export const setTimeChoiced = (time: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState().detailCourt;
    const { dateChoiced, numberChoie } = state;
    const timeItem = { ...time, dateChoiced, numberChoie };
    const timeChoice = [...state.timeChoice, timeItem];
    dispatch({
      type: SET_TIME_CHOICED,
      payload: timeChoice,
    });
    dispatch(calculateTotalPrice());
  };
};

export const setTimeChoicedRe = (time: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState().detailCourt;
    const { startTime, endTime, dateChoiced, numberChoie } = time;
    const timeChoice = state.timeChoice.filter(
      (item: any) =>
        item.startTime !== startTime &&
        item.endTime !== endTime &&
        item.dateChoiced !== dateChoiced &&
        item.numberChoie !== numberChoie
    );
    dispatch({
      type: SET_TIME_CHOICED,
      payload: timeChoice,
    });
    dispatch(calculateTotalPrice());
  };
};

export const setTotalPrice = (totalPrice: number) => {
  return {
    type: SET_TOTAL_PRICE,
    payload: totalPrice,
  };
};

export const setDateChoiced = (date: string) => {
  return {
    type: SET_DATE_CHOICED,
    payload: date,
  };
};

export const setTimeslotStatus = (timeslotStatus: any) => {
  return {
    type: SET_TIMESLOT_STATUS,
    payload: timeslotStatus,
  };
};

export const calculateTotalPrice = () => {
  return (dispatch: any, getState: any) => {
    const state = getState().detailCourt;
    const totalPrice = state.timeChoice.reduce(
      (acc: number, item: any) => acc + item.price,
      0
    );
    dispatch(setTotalPrice(totalPrice));
    dispatch(getCanSubmit());
  };
};

export const getCanSubmit = () => {
  return (dispatch: any, getState: any) => {
    const state = getState().detailCourt;
    const { timeChoice } = state;
    dispatch(setCanSubmit(timeChoice.length > 0));
  };
};

export const getCourt = (id: string, navigate: any) => async (dispatch: any, getState: any) => {
  try {
    const response = await getCourtByIdService(id);
    if (response) {
      const { _id: courtId, name, location, number, ownerId, images, description, timeslot } =
        response;
      if(ownerId === getState().user.user._id){
        navigate(navigateToPage(pages.CREATE_COURT_PAGE, id));
      }
      dispatch(
        setCourt({
          courtId,
          name,
          location,
          number,
          ownerId,
          images,
          description,
          timeslot,
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const createInvoice = () =>
  async (dispatch: any, getState: any) => {
    dispatch(onSubmitRequest());
    await delay(1000);
    const { ownerId, timeChoice } = getState().detailCourt;
    const { _id: userId } = getState().user.user;
    if(!userId){
      dispatch(onSubmitFailure(text["DetailCourt.errorMessage.noLogin"]));
      return;
    }
    if(userId === ownerId){
      dispatch(onSubmitFailure(text["DetailCourt.errorMessage.owner"]));
      return;
    }
    if(timeChoice.length === 0){
      dispatch(onSubmitFailure(text["DetailCourt.errorMessage.timeSlot"]));
      return;
    }
    try {
      console.log(userId, ownerId, timeChoice);
      const response = await createInvoiceService(userId, ownerId, timeChoice);
      if (response) {
        dispatch(onSubmitSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getStatusTimeslot = () =>
  async (dispatch: any, getState: any) => {
    const { courtId, dateChoiced, numberChoie } = getState().detailCourt;
    const response = await getStatusTimeslotService(courtId, dateChoiced, numberChoie);
    dispatch(setTimeslotStatus(response));
  };
