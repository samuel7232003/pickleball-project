import { getCourtByIdService } from "../../services/court";

const initialState = {
  name: "",
  location: "",
  number: "",
  images: [],
  owner_id: "",
  timeslot: [],
  description: "",
  numberChoie: 0,
  timeChoie: [],
  totalPrice: 0,
  dateChoiced: "",
  isLoading: false,
  canSubmit: false,
};

export const SET_COURT = "SET_COURT";
export const SET_NUMBER_CHOICED = "SET_NUMBER_CHOICED";
export const SET_TIME_CHOICED = "SET_TIME_CHOICED";
export const SET_TOTAL_PRICE = "SET_TOTAL_PRICE";
export const SET_DATE_CHOICED = "SET_DATE_CHOICED";
export const ON_SUBMIT_REQUEST = "ON_SUBMIT_REQUEST";
export const ON_SUBMIT_SUCCESS = "ON_SUBMIT_SUCCESS";
export const ON_SUBMIT_FAILURE = "ON_SUBMIT_FAILURE";

export const detailCourtReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_COURT":
      return { ...state, ...action.payload };
    case "SET_NUMBER_CHOICED":
      return { ...state, numberChoie: action.payload };
    case "SET_TIME_CHOICED":
      return { ...state, timeChoie: action.payload };
    case "SET_TOTAL_PRICE":
      return { ...state, totalPrice: action.payload };
    case "SET_DATE_CHOICED":
      return { ...state, dateChoiced: action.payload };
    case "ON_SUBMIT_REQUEST":
      return { ...state, isLoading: true };
    case "ON_SUBMIT_SUCCESS":
      return { ...state, isLoading: false, canSubmit: true };
    case "ON_SUBMIT_FAILURE":
      return { ...state, isLoading: false, canSubmit: false };
    case "SET_CAN_SUBMIT":
      return { ...state, canSubmit: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export const setCourt = (court: any) => {
  return {
    type: "SET_COURT",
    payload: court,
  };
};

export const setNumberChoiced = (number: number) => {
  return {
    type: "SET_NUMBER_CHOICED",
    payload: number,
  };
};

export const onSubmitRequest = () => {
  return {
    type: "ON_SUBMIT_REQUEST",
  };
};

export const onSubmitSuccess = () => {
  return {
    type: "ON_SUBMIT_SUCCESS",
  };
};

export const onSubmitFailure = () => {
  return {
    type: "ON_SUBMIT_FAILURE",
  };
};  

export const setCanSubmit = (canSubmit: boolean) => {
  return {
    type: "SET_CAN_SUBMIT",
    payload: canSubmit,
  };
};

export const setTimeChoiced = (time: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState().detailCourt;
    const { dateChoiced, numberChoie } = state;
    const timeItem = { ...time, dateChoiced, numberChoie };
    const timeChoie = [...state.timeChoie, timeItem];
    dispatch({
      type: "SET_TIME_CHOICED",
      payload: timeChoie,
    });
    dispatch(calculateTotalPrice());
  };
};

export const setTimeChoicedRe = (time: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState().detailCourt;
    const { startTime, endTime, dateChoiced, numberChoie } = time;
    const timeChoie = state.timeChoie.filter(
      (item: any) =>
        item.startTime !== startTime &&
        item.endTime !== endTime &&
        item.dateChoiced !== dateChoiced &&
        item.numberChoie !== numberChoie
    );
    dispatch({
      type: "SET_TIME_CHOICED",
      payload: timeChoie,
    });
    dispatch(calculateTotalPrice());
  };
};

export const setTotalPrice = (totalPrice: number) => {
  return {
    type: "SET_TOTAL_PRICE",
    payload: totalPrice,
  };
};

export const setDateChoiced = (date: string) => {
  return {
    type: "SET_DATE_CHOICED",
    payload: date,
  };
};

export const calculateTotalPrice = () => {
  return (dispatch: any, getState: any) => {
    const state = getState().detailCourt;
    const totalPrice = state.timeChoie.reduce(
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
    const { timeChoie } = state;
    dispatch(setCanSubmit(timeChoie.length > 0));
  };
};

export const getCourt = (id: string) => async (dispatch: any) => {
  try {
    const response = await getCourtByIdService(id);
    if (response) {
      const {
        name,
        location,
        number,
        owner_id,
        timeslot,
        images,
        description,
      } = response;
      dispatch(
        setCourt({
          name,
          location,
          number,
          owner_id,
          timeslot,
          images,
          description,
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};
