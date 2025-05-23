import { locations } from "../../common/constants";
import { getCurrentWeather } from "../../services/weather";

// actions
const FETCH_WEATHER_REQUEST = "weather/FETCH_WEATHER_REQUEST";
const FETCH_WEATHER_SUCCESS = "weather/FETCH_WEATHER_SUCCESS";
const FETCH_WEATHER_FAILURE = "weather/FETCH_WEATHER_FAILURE";

// action creators
export const fetchWeatherRequest = () => ({ type: FETCH_WEATHER_REQUEST });
export const fetchWeatherSuccess = (data: any) => ({
  type: FETCH_WEATHER_SUCCESS,
  payload: data,
});
export const fetchWeatherFailure = (error: any) => ({
  type: FETCH_WEATHER_FAILURE,
  payload: error,
});

export const fetchWeather =
  (location: string = locations.DEFAULT) =>
  async (dispatch: any) => {
    try {
      dispatch(fetchWeatherRequest());
      const data = await getCurrentWeather(location);
      dispatch(fetchWeatherSuccess(data));
    } catch (error) {
      dispatch(fetchWeatherFailure(error));
    }
  };

// reducer
const initialState = {
  loading: false,
  data: null,
  error: null,
};

export default function weatherReducer(state = initialState, action: any) {
  switch (action.type) {
    case FETCH_WEATHER_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_WEATHER_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_WEATHER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
