export default function ButtonWeather(props: any) {
  const {
    buttonElement,
    weatherIconElement,
    textCityElement,
    textTempElement,
    weather,
  } = props;

  if(!weather) return null;

  const { current, location } = weather;

  return (
    <div className={buttonElement}>
      <figure className={weatherIconElement}>
        <img src={current.condition.icon} alt="" />
      </figure>
      <p className={textCityElement}>{location.name}</p>
      <p>-</p>
      <p className={textTempElement}>{current.temp_c}°C</p>
    </div>
  );
}
