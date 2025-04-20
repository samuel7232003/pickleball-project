import { createBrowserRouter } from "react-router-dom";
import Home from "./screens/Home";
import { Welcome } from "./pages/welcome/Welcome";
import NewFeed from "./pages/newFeed/NewFeed";
import SearchPage from "./pages/search/SearchPage";

export const pages = {
  NEW_FEED_PAGE: "FEED",
  WELCOME_PAGE: "HOME",
  SEARCH_PAGE: "SEARCH",
  LOGIN_PAGE: "LOGIN",
}

export const router = createBrowserRouter(
  [
    {
      path:"/",
      element: <Home/>,
      children:[
        {
          path: "",
          element: <Welcome/>
        },
        {
          path: "newFeed",
          element: <NewFeed/>
        },
        {
          path: "search",
          element: <SearchPage/>
        }
      ]
    }
  ]
)