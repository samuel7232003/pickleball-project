import { dataItemTest } from "./CreateCourt.test";

const initialState = {
  name: "",
  location: "",
  lat: 0,
  lng: 0,
  images: [],
  description: "",
  number: 1,
  listTimeslot: dataItemTest,
};

export const ON_CHANGE_NAME = "ON_CHANGE_NAME";
export const ON_CHANGE_LOCATION = "ON_CHANGE_LOCATION";
export const ON_CHANGE_DESCRIPTION = "ON_CHANGE_DESCRIPTION";
export const ON_CHANGE_LIST_TIMESLOT = "ON_CHANGE_LIST_TIMESLOT";
export const ON_CHANGE_NUMBER = "ON_CHANGE_NUMBER";

export default function createCourtReducer(state = initialState, action: any) {
  switch (action.type) {
    case ON_CHANGE_NAME: {
      return { ...state, name: action.payload };
    }
    case ON_CHANGE_LOCATION: {
      return { ...state, location: action.payload };
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
