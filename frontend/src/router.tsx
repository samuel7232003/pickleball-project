import { createBrowserRouter } from "react-router-dom";
import Home from "./screens/Home";

export const router = createBrowserRouter(
  [
    {
      path:"/",
      element: <Home/>,
      children:[

      ]
    }
  ]
)