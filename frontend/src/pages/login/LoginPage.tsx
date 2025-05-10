import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { pages } from "../../router";
import css from "./LoginPage.module.css";
import text from "../../util/text";
import FieldInputText from "../../components/fields/FieldInputText";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  handleLoginClick,
  handleSignupClick,
  loginReset,
  ON_CHANGE_FIRST_NAME,
  ON_CHANGE_LAST_NAME,
  ON_CHANGE_PASSWORD,
  ON_CHANGE_REPASSWORD,
  ON_CHANGE_USERNAME,
  onChangeField,
} from "./LoginPage.duck";
import LoginPageWithGoogle from "./components/LoginPageWithGoogle";
import ButtonText from "../../components/buttons/ButtonText";
import ErrorText from "../../components/messages/ErrorText";
import FieldInputPassword from "../../components/fields/FieldInputPassword";
import FieldInputName from "../../components/fields/FieldInputName";

interface Props {
  isLoginPage?: boolean;
}

export default function LoginPage(props: Props) {
  const { isLoginPage } = props;
  const { setCurPage }: any = useOutletContext();
  const dispatch = useDispatch<AppDispatch>();
  const {
    username,
    password,
    errorMessage,
    loading,
    firstName,
    lastName,
    rePassword,
  } = useSelector((state: any) => state.loginPage);
  const navigate = useNavigate();

  useEffect(() => {
    setCurPage(isLoginPage ? pages.LOGIN_PAGE_LOGIN : pages.LOGIN_PAGE_SIGNUP);
    dispatch(loginReset());
  }, [isLoginPage]);

  const onChangeFieldInput = (type: string) => (e: any) => {
    dispatch(onChangeField(type, e.target.value));
  };

  const handleSubmit = () => {
    if(isLoginPage) dispatch(handleLoginClick(navigate));
    else dispatch(handleSignupClick(navigate));
  };

  return (
    <main className={css.main}>
      <div className={css.login_box}>
        <h2>
          {isLoginPage
            ? text["LoginPage.loginTitle"]
            : text["LoginPage.signupTitle"]}
        </h2>
        {!isLoginPage && (
          <FieldInputName
            blockElement={css.fieldInputMain}
            titleElement={css.fieldInputTitle}
            title={text["LoginPage.nameFieldTitle"]}
            inputElementBox={css.inputElementBox}
            inputElement={css.fieldInput}
            inputPlaceholderFirstName={text["LoginPage.firstNamePlaceholder"]}
            inputPlaceholderLastName={text["LoginPage.lastNamePlaceholder"]}
            onChangeFirstName={onChangeFieldInput(ON_CHANGE_FIRST_NAME)}
            onChangeLastName={onChangeFieldInput(ON_CHANGE_LAST_NAME)}
            valueFirstName={firstName}
            valueLastName={lastName}
          />
        )}
        <FieldInputText
          blockElement={css.fieldInputMain}
          titleElement={css.fieldInputTitle}
          title={text["LoginPage.emailFieldTitle"]}
          inputElement={css.fieldInput}
          inputPlaceholder={text["LoginPage.emailPlaceholder"]}
          onChange={onChangeFieldInput(ON_CHANGE_USERNAME)}
          value={username}
        />
        <FieldInputPassword
          blockElement={css.fieldInputMain}
          titleElement={css.fieldInputTitle}
          title={text["LoginPage.passwordFieldTitle"]}
          inputElement={css.fieldInput}
          inputPlaceholder={text["LoginPage.passwordPlaceholder"]}
          onChange={onChangeFieldInput(ON_CHANGE_PASSWORD)}
          value={password}
        />
        {!isLoginPage && (
          <FieldInputPassword
            blockElement={css.fieldInputMain}
            titleElement={css.fieldInputTitle}
            title={text["LoginPage.confirmPasswordFieldTitle"]}
            inputElement={css.fieldInput}
            inputPlaceholder={text["LoginPage.confirmPasswordPlaceholder"]}
            onChange={onChangeFieldInput(ON_CHANGE_REPASSWORD)}
            value={rePassword}
          />
        )}
        <ErrorText content={errorMessage} />
        <LoginPageWithGoogle
          mainElement={css.login_google}
          googleIconElement={css.login_google_icon}
          content={
            isLoginPage
              ? text["LoginPage.loginGoogle"]
              : text["LoginPage.signupGoogle"]
          }
          contentElement={css.login_google_content}
        />
        <ButtonText
          buttonElement={css.buttonLogin}
          content={
            isLoginPage
              ? text["LoginPage.loginButton"]
              : text["LoginPage.signupButton"]
          }
          contentElement={css.buttonLoginContent}
          handleOnClick={handleSubmit}
          loading={loading}
        />
      </div>
    </main>
  );
}
