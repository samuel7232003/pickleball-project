import { ThunkAction } from "redux-thunk";
import userSlice, { initialUserState } from "./user.slice";
import { RootState } from "../store";
import { AnyAction } from "@reduxjs/toolkit";
import { checkLogin } from "../../services/auth";
import { logout } from "../../services/account";

export const userActions = userSlice.actions;

export const getProfile = (): ThunkAction<
  void,
  RootState,
  unknown,
  AnyAction
> => {
  return async (dispatch, getState) => {
    const response: any = await checkLogin();
    if (response) {
      dispatch(userActions.setUser(response)); // cập nhật user vào redux store
    } else {
      dispatch(userActions.setUser(initialUserState.user)); // hoặc dispatch logout nếu muốn
    }
  };
};

export const logoutAction = (): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    await logout();
    dispatch(userActions.setUser(initialUserState.user));
  };
};

// export const loginAction = (username: string, password: string):ThunkAction<void, RootState, unknown, AnyAction> => {
//   return async(dispatch, getState) =>{
//     const response = await login(username, password);
//     console.log(response);
//   }
// }

// export const getUser = (id: string):ThunkAction<void, RootState, unknown, AnyAction> => {
//     return async(dispatch, getState) => {
//         const response :User = await getAccount(id, "");
//         dispatch(userActions.setUser(response));
//     }
// }

// export const editUser = (user: User):ThunkAction<void, RootState, unknown, AnyAction> => {
//     return async(dispatch, getState) => {
//         dispatch(userActions.setUser({...user}));
//         await editAccount(user);
//     }
// }
