import navigateToPage from "../../config/navigate";
import { login, signup } from "../../services/account";
import text from "../../util/text";
import { getProfile } from "../../redux/user/user.action";
import { User } from "../../redux/user/user.state";

// actions
export const ON_CHANGE_USERNAME = "loginPage/ON_CHANGE_USERNAME";
export const ON_CHANGE_PASSWORD = "loginPage/ON_CHANGE_PASSWORD";
export const LOGIN_RESET = "loginPage/LOGIN_RESET";
export const LOGIN_REQUEST = "loginPage/LOGIN_REQUEST";
export const LOGIN_FAIL = "loginPage/LOGIN_FAIL";
export const LOGIN_SUCCESS = "loginPage/LOGIN_SUCCESS";
export const ON_CHANGE_FIRST_NAME = "loginPage/ON_CHANGE_FIRST_NAME";
export const ON_CHANGE_LAST_NAME = "loginPage/ON_CHANGE_LAST_NAME";
export const ON_CHANGE_REPASSWORD = "loginPage/ON_CHANGE_REPASSWORD";
 
// action creators
export const onChangeField = (type:string, value:string) =>({
  type: type, 
  payload: value,
})

const loginRequest = () => ({
  type: LOGIN_REQUEST
})

const loginFail = (message:string) =>({
  type: LOGIN_FAIL,
  payload: message,
})

const loginSuccess = () =>({
  type: LOGIN_SUCCESS
})

export const loginReset = ()=>({
  type: LOGIN_RESET
})

// reducer
const initialState = {
  username: "",
  firstName: "",
  lastName: "",
  password: "",
  errorMessage: "",
  rePassword: "",
  loading: false, 
};

export default function loginPageReducer(state = initialState, action: any){
  switch (action.type){
    case ON_CHANGE_USERNAME: {
      return {...state, username: action.payload};
    }
    case ON_CHANGE_PASSWORD: {
      return {...state, password: action.payload};
    }
    case ON_CHANGE_FIRST_NAME: {
      return {...state, firstName: action.payload};
    }
    case ON_CHANGE_LAST_NAME: {
      return {...state, lastName: action.payload};
    }
    case ON_CHANGE_REPASSWORD: {
      return {...state, rePassword: action.payload};
    }
    case LOGIN_RESET: {
      return {...state, errorMessage: ""};
    }
    case LOGIN_REQUEST: {
      return {...state, loading: true, errorMessage: ""};
    }
    case LOGIN_FAIL:{
      return {...state, loading: false, errorMessage: action.payload};
    }
    case LOGIN_SUCCESS:{
      return {...state, loading: false};
    }
    default: return state;
  }
}

// ================ Thunks ================ //

export const handleLoginClick = (navigate: any) => async (dispatch:any, getState:any) => {
  dispatch(loginRequest());
  const { username, password } = getState().loginPage;
  if(username.trim() === "") return dispatch(loginFail(text["LoginPage.errorMissingFieldUsername"]));
  if(password.trim() === "") return dispatch(loginFail(text["LoginPage.errorMissingFieldPassword"]));
  const res:any = await login(username, password);
  if(res){
    const {EC, EM} = res;
    if(EC === 2) return dispatch(loginFail((text as any)[`LoginPage.${EM}`]));
    if(EC === 0) {
      const backPage = sessionStorage.getItem("backPage");
      await dispatch(getProfile());
      navigate(navigateToPage(backPage || "/"));
      return dispatch(loginSuccess());
    } 
  }
}

export const handleSignupClick = (navigate: any) => async (dispatch:any, getState:any) => {
  dispatch(loginRequest());
  const { username, lastName, firstName, password, rePassword } = getState().loginPage;
  const isFullFill = username.trim() !== "" && lastName.trim() !== "" && firstName !== "" && password !==""; 
  if(!isFullFill) return dispatch(loginFail(text["LoginPage.errorMissingField"]));
  if(password.trim()!==rePassword.trim()) return dispatch(loginFail(text["LoginPage.errorConfirmPassword"]));
  const user: User = {username: username, last_name: lastName, first_name: firstName, password: password};
  const res:any = await signup(user);
  if(res){
    const {EC} = res;
    if(EC === 1 || EC === 2) return dispatch(loginFail(text["LoginPage.errorSignup"]));
    if(EC === 0) {
      const backPage = sessionStorage.getItem("backPage");
      await dispatch(getProfile());
      navigate(navigateToPage(backPage || "/"));
      return dispatch(loginSuccess());
    } 
  }
}
