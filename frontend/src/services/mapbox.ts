export const searchMapbox = async (query: string) => {
  const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Mapbox access token is missing");
    return [];
  }

  try {
    const res = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          query
        )}&access_token=${accessToken}&bbox=102.14441,8.17966,109.46463,23.39239`
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();
      return data.features || [];
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}