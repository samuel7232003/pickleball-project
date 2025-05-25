import { apiInstance } from "./api";

export async function doPayment(userInfor: any) {
  const {_id: userId, first_name, last_name, invoice, totalPrice, timeslot} = userInfor;
  try {
    const data = {
      amount: totalPrice,
      userId: userId,
      name: `${first_name} ${last_name}`,
      idInvoice: invoice._id,
      timeslot: timeslot,
    };
    const respone: any = await apiInstance.post(
      "/create-embedded-payment-link",
      data
    );
    return respone;
  } catch (error) {
    throw error;
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
