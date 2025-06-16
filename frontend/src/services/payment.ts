import text from "../util/text";
import { apiInstance } from "./api";

interface PaymentRequest {
  amount: number;
  userId: string;
  name: string;
  invoiceId: string;
  expiredAt?: number;
}

interface PaymentResponse {
  checkoutUrl: string;
}

export async function doPayment(
  userId: string,
  invoiceId: string,
  amount: number,
  name: string
): Promise<PaymentResponse> {
  if (!userId || !invoiceId || !amount || !name) {
    throw new Error(text["PaymentPage.message.error"]);
  }

  if (amount <= 0) {
    throw new Error(text["PaymentPage.message.error.amount"]);
  }

  try {
    // Set expiration time to 5 minutes from now
    const expiredAt = Date.now() + 5 * 60 * 1000;

    const data: PaymentRequest = {
      amount,
      userId,
      name,
      invoiceId,
      expiredAt,
    };

    const response = await apiInstance.post<PaymentResponse>(
      "/create-embedded-payment-link",
      data
    ) as unknown as PaymentResponse;

    if (!response.checkoutUrl) {
      throw new Error("Invalid payment response");
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Payment failed: ${error.message}`);
    }
    throw new Error("Payment failed: Unknown error");
  }
}

// export async function savePending(userInfor: User, idBill: string) {
//   try {
//     const amount_ = userInfor.listSeat.length * 50000;
//     const data = {
//       amount: amount_,
//       name: userInfor.name,
//       phone: userInfor.phone,
//       email: userInfor.email,
//       listSeat: userInfor.listSeat,
//       address: userInfor.address,
//       idBill: idBill,
//     };
//     const respone: any = await apiInstance.post("/setPending", data);
//     return respone;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function getDataSeat() {
//   try {
//     await apiInstance("/deleteOutTime");
//     const respone: any = await apiInstance.get("/getSeat");
//     let listSeat: Seat[] = [];
//     for (let i = 0; i < respone.length; i++) {
//       const seat: Seat = {
//         idTicket: respone[i]._id,
//         name: respone[i].seat,
//         status: respone[i].status,
//       };
//       listSeat.push(seat);
//     }
//     return listSeat;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function getDataTicket() {
//   try {
//     const respone: any = await apiInstance.get("/getSeat");
//     let listTicket: Ticket[] = [];
//     for (let i = 0; i < respone.length; i++) {
//       const ticket: Ticket = {
//         idTicket: respone[i]._id,
//         name: respone[i].name,
//         phone: respone[i].phone,
//         seat: respone[i].seat,
//         code: "",
//       };
//       listTicket.push(ticket);
//     }
//     return listTicket;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function setFail(idBill: string) {
//   try {
//     const respone = await apiInstance(`/deleteBill?idBill=${idBill}`);
//     return respone;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function deleteOutTime() {
//   try {
//     const respone = await apiInstance("/deleteOutTime");
//     console.log(respone);
//     return respone;
//   } catch (error) {
//     throw error;
//   }
// }
