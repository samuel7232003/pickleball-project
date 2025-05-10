import { useEffect, useState } from "react";
import navigateToPage from "../../config/navigate";
import { tagsDefault } from "../../constants/common";
import { pages } from "../../router";
import { getIconValueByKey, getImageAvatar} from "../../util/getAssets";
import { ButtonCircleIcon } from "../buttons/ButtonCircleIcon";
import ButtonLogin from "../buttons/ButtonLogin";
import ButtonWeather from "../buttons/ButtonWeather";
import css from "./Header.module.css";
import { fetchWeather } from "./Header.duck";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/builder";
import { useNavigate } from "react-router-dom";
import text from "../../util/text";
import { getProfile, logoutAction } from "../../redux/user/user.action";

export default function Header(props: any) {
  const {
    tags,
    shouldShowWeather = true,
    shouldShowLogin = true,
    curPage,
  } = props;
  const listTags = tags || Object.keys(tagsDefault);

  const { username, avatar, first_name } = useAppSelector((state) => state.user.user);
  const isLogin = !!username;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { weather } = useSelector(
    (state: any) => ({
      weather: state.weather.data,
      loading: state.weather.loading,
    }),
    shallowEqual
  );
  const [isCurPageLoginPage, setIsCurPageLoginPage] = useState(true);
  const [buttonText, setButtonText] = useState("");

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (shouldShowWeather && !weather) {
      dispatch(fetchWeather());
    }
  }, [shouldShowWeather, dispatch, weather]);

  useEffect(() => {
    const isLoginPage =
      curPage === pages.LOGIN_PAGE_LOGIN || curPage === pages.LOGIN_PAGE_SIGNUP;
    setIsCurPageLoginPage(isLoginPage);

    const getButtonText = isLogin
      ? first_name
      : curPage === pages.LOGIN_PAGE_LOGIN
      ? text["Header.signup"]
      : text["Header.login"];
    setButtonText(getButtonText);
  }, [curPage, username]);

  const ButtonCircleIconMaybe = () => {
    return (
      <>
        {listTags.map((tag: any) => (
          <ButtonCircleIcon
            key={tag}
            buttonElement={css.buttonCircle}
            buttonElementPre={css.buttonCirclePre}
            isPrimaryButtons={tag === curPage}
            iconUrl={getIconValueByKey({ key: tag })}
            iconPrimaryUrl={getIconValueByKey({ key: tag, isPre: true })}
            navigatePage={navigateToPage(tag)}
          />
        ))}
      </>
    );
  };

  function handleClickLogin() {
    const target =
      curPage === pages.LOGIN_PAGE_LOGIN
        ? pages.LOGIN_PAGE_SIGNUP
        : pages.LOGIN_PAGE_LOGIN;
    if (
      curPage !== pages.LOGIN_PAGE_LOGIN &&
      curPage !== pages.LOGIN_PAGE_SIGNUP
    ) {
      sessionStorage.setItem("backPage", curPage);
    }
    navigate(navigateToPage(target));
  }

  const handleClickLoginReady = () =>{
    dispatch(logoutAction());
  }

  return (
    <header className={css.header}>
      <div className={css.headerInner}>
        {shouldShowWeather ? (
          <ButtonWeather
            buttonElement={css.buttonWeather}
            weatherIconElement={css.iconWeather}
            textCityElement={css.textCity}
            textTempElement={css.textTemp}
            weather={weather}
          />
        ) : null}
        <ButtonCircleIconMaybe />
        {shouldShowLogin ? (
          <ButtonLogin
            isLogin={isLogin}
            buttonElement={css.buttonLogin}
            buttonElementPre={css.buttonLoginPre}
            avatarElement={css.avatar}
            textElement={css.textLogin}
            handleClick={handleClickLogin}
            handleClickLoginReady={handleClickLoginReady}
            avatarUrl={getImageAvatar(avatar)}
            isPrimaryButton={isCurPageLoginPage}
            buttonText={buttonText}
          />
        ) : null}
      </div>
    </header>
  );
}
