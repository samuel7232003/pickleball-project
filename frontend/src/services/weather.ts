const API_KEY = process.env.REACT_APP_WEATHER_KEY
const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL + "/current.json"

/**
 * Hàm lấy thời tiết hiện tại
 * @param location Vị trí (có thể là tên thành phố, tọa độ, mã bưu điện...)
 * @returns Thông tin thời tiết hiện tại
 */

export async function getCurrentWeather(location: string) {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${location}`);
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}