import { useEffect } from "react";
import navigateToPage from "../../config/navigate";
import { tagsDefault } from "../../constants/common";
import { pages } from "../../router";
import { getIconValueByKey, getImage, imagesName } from "../../util/getAssets";
import { ButtonCircleIcon } from "../buttons/ButtonCircleIcon";
import ButtonLogin from "../buttons/ButtonLogin";
import ButtonWeather from "../buttons/ButtonWeather";
import css from "./Header.module.css";
import { fetchWeather } from "./Header.duck";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";

export default function Header(props: any) {
  const { tags, shouldShowWeather = true, shouldShowLogin = true, curPage } = props;
  const listTags = tags || Object.keys(tagsDefault);

  const dispatch = useDispatch<AppDispatch>();

  const { weather, loading } = useSelector(
    (state: any) => ({
      weather: state.weather.data,
      loading: state.weather.loading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (shouldShowWeather && !weather) {
      dispatch(fetchWeather());
    }
  }, [shouldShowWeather, dispatch, weather]);

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
    navigateToPage(pages.LOGIN_PAGE);
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
            isLogin={true}
            buttonElement={css.buttonLogin}
            avatarElement={css.avatar}
            textElement={css.textLogin}
            handleClick={handleClickLogin}
            avatarUrl={getImage(imagesName.AVATAR_TEST)}
          />
        ) : null}
      </div>
    </header>
  );
}
