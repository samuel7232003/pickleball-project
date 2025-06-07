import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { getInvoicePendingService } from "../../services/invoice";

const initialState = {
  invoice:{
    _id: "",
    orderCode: "",
    amount: 0,
    paymentStatus: "",
  },
  timeslot: [],
  court: {
    name: "",
    location: "",
  },
  isLoading: false,
  errorMessage: null,
  isPaymentProcessing: false,
  totalPrice: 0,
};

const GET_INVOICE_PENDING = "GET_INVOICE_PENDING";
const SET_TOTAL_PRICE = "SET_TOTAL_PRICE";

export const paymentPageReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_INVOICE_PENDING:
      return {
        ...state,
        invoice: action.payload.invoice,
        timeslot: action.payload.timeslot,
        court: action.payload.court,
      };
    case SET_TOTAL_PRICE:
      return {
        ...state,
        totalPrice: action.payload.totalPrice,
      };
    default:
      return state;
  }
};

export const getInvoicePending = (invoice: any, timeslot: any, court: any) => {
  return {
    type: GET_INVOICE_PENDING,
    payload: { invoice, timeslot, court },
  };
};

export const setTotalPrice = (totalPrice: number) => {
  return {
    type: SET_TOTAL_PRICE,
    payload: { totalPrice },
  };
};

export const calculateTotalPrice = (timeslot: any) => {
  if(!timeslot) {
    return setTotalPrice(0);
  }
  const totalPrice = timeslot.reduce(
    (acc: number, curr: any) => acc + curr.price,
    0
  );
  return setTotalPrice(totalPrice);
};

export const getInitialData =
  (userId: string, navigate: any) => async (dispatch: any, getState: any) => {
    try {
      const response: any = await getInvoicePendingService(userId);
      
      if(response === null) {
        navigate(navigateToPage(pages.WELCOME_PAGE));
        return;
      }
      console.log(response);
      const { invoice, timeslot, court } = response;
      dispatch(getInvoicePending(invoice, timeslot, court));
      dispatch(calculateTotalPrice(timeslot));
    } catch (error) {
      console.log(error);
    }
  };
