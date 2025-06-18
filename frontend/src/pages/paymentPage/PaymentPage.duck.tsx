import { invoiceStatus } from "../../common/constants";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { getInvoicePendingService, updateInvoiceService } from "../../services/invoice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface Timeslot {
  _id: string;
  startTime: string;
  endTime: string;
  price: number;
}

export interface Court {
  name: string;
  location: string;
}

export interface Invoice {
  _id: string;
  orderCode: string;
  amount: number;
  paymentStatus: string;
}

export interface PaymentPageState {
  invoice: Invoice;
  timeslot: Timeslot[];
  court: Court;
  errorMessage: string | null;
  isPaymentProcessing: boolean;
  totalPrice: number;
  isPaymentSuccess: boolean;
  isViewMode: boolean;
}

const initialState: PaymentPageState = {
  invoice: {
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
  errorMessage: null,
  isPaymentProcessing: false,
  totalPrice: 0,
  isPaymentSuccess: false,
  isViewMode: false,
};

const paymentPageSlice = createSlice({
  name: "paymentPage",
  initialState,
  reducers: {
    getInvoicePending: (
      state,
      action: PayloadAction<{
        invoice: Invoice;
        timeslot: Timeslot[];
        court: Court;
      }>
    ) => {
      state.invoice = action.payload.invoice;
      state.timeslot = action.payload.timeslot;
      state.court = action.payload.court;
      state.errorMessage = null;
    },
    setIsPaymentSuccess: (state, action: PayloadAction<{ isPaymentSuccess: boolean }>) => {
      state.isPaymentSuccess = action.payload.isPaymentSuccess;
    },
    setTotalPrice: (state, action: PayloadAction<{ totalPrice: number }>) => {
      state.totalPrice = action.payload.totalPrice;
    },
    paymentProcessing: (
      state,
      action: PayloadAction<{ isPaymentProcessing: boolean }>
    ) => {
      state.isPaymentProcessing = action.payload.isPaymentProcessing;
    },
    setError: (state, action: PayloadAction<{ errorMessage: string | null }>) => {
      state.errorMessage = action.payload.errorMessage;
    },
    setIsViewMode: (state, action: PayloadAction<{ isViewMode: boolean }>) => {
      state.isViewMode = action.payload.isViewMode;
    },
    setInvoiceStatus: (state, action: PayloadAction<{ paymentStatus: string }>) => {
      state.invoice.paymentStatus = action.payload.paymentStatus;
    },
  },
});

export const {
  getInvoicePending,
  setTotalPrice,
  paymentProcessing,
  setError,
  setIsPaymentSuccess,
  setIsViewMode,
  setInvoiceStatus,
} = paymentPageSlice.actions;

export const paymentPageReducer = paymentPageSlice.reducer;

// Thunks
export const calculateTotalPrice = (timeslot: Timeslot[]) => {
  if (!timeslot || timeslot.length === 0) {
    return setTotalPrice({ totalPrice: 0 });
  }
  const totalPrice = timeslot.reduce((acc, curr) => acc + curr.price, 0);
  return setTotalPrice({ totalPrice });
};

export const getInitialData =
  (userId: string, navigate: any, invoiceId: string) => async (dispatch: any) => {
    try {
      const response = await getInvoicePendingService(userId, invoiceId);

      if (!response) {
        navigate(navigateToPage(pages.WELCOME_PAGE));
        return;
      }

      const { invoice, timeslot, court } = response;
      if (invoice.paymentStatus === invoiceStatus.PAID || invoice.paymentStatus === invoiceStatus.EXPIRED) {
        dispatch(setIsPaymentSuccess({ isPaymentSuccess: true }));
      }
      dispatch(getInvoicePending({ invoice, timeslot, court }));
      dispatch(calculateTotalPrice(timeslot));
      if(invoice.userId !== userId){
        dispatch(setIsViewMode({ isViewMode: true }));
      }
    } catch (error) {
      dispatch(
        setError({
          errorMessage: error instanceof Error ? error.message : "An error occurred",
        })
      );
    }
  };

export const handlePaymentSuccess = () => {
  return async (dispatch: any, getState: any) => {
    const { invoice } = getState().paymentPage;
    try {
      const response = await updateInvoiceService(invoice._id, invoiceStatus.PAID);
      console.log(response);
      dispatch(setIsPaymentSuccess({ isPaymentSuccess: true }));
      dispatch(paymentProcessing({ isPaymentProcessing: false }));
      dispatch(setInvoiceStatus({ paymentStatus: invoiceStatus.PAID }));
    } catch (error) {
      dispatch(
        setError({
          errorMessage: error instanceof Error ? error.message : "Payment failed",
        })
      );
    }
  };
};

export const handlePaymentTimeout = () => {
  return async (dispatch: any) => {
    dispatch(paymentProcessing({ isPaymentProcessing: false }));
  };
};

export const updateInvoiceStatusToWaiting = () => {
  return async (dispatch: any, getState: any) => {
    const { invoice } = getState().paymentPage;
    await updateInvoiceService(invoice._id, invoiceStatus.WAITING);
  };
};