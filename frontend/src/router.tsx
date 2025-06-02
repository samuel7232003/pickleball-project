import { createBrowserRouter } from "react-router-dom";
import Home from "./screens/Home";
import { Welcome } from "./pages/welcome/Welcome";
import NewFeed from "./pages/newFeed/NewFeed";
import SearchPage from "./pages/search/SearchPage";
import LoginPage from "./pages/login/LoginPage";
import CreateCourt from "./pages/createCourt/CreateCourt";
import DetailCourt from "./pages/detailCourt/DetailCourt";
import PaymentPage from "./pages/paymentPage/PaymentPage";
import PersonalPage from "./pages/personal/PersonalPage";

export const pages = {
  NEW_FEED_PAGE: "FEED",
  WELCOME_PAGE: "HOME",
  SEARCH_PAGE: "SEARCH",
  LOGIN_PAGE_LOGIN: "LOGIN",
  LOGIN_PAGE_SIGNUP: "SIGNUP",
  CREATE_COURT_PAGE: "CREATE_COURT",
  DETAIL_COURT_PAGE: "DETAIL_COURT",
  PAYMENT_PAGE: "PAYMENT",
  PERSONAL_PAGE: "PERSONAL",
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "",
        element: <Welcome />,
      },
      {
        path: "newFeed",
        element: <NewFeed />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <LoginPage isLoginPage={true} />,
      },
      {
        path: "signup",
        element: <LoginPage isLoginPage={false} />,
      },
      {
        path: "createCourt/:id",
        element: <CreateCourt />,
      },
      {
        path: "detailCourt/:id",
        element: <DetailCourt />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
      {
        path: "personal/:id",
        element: <PersonalPage />,
      },
    ],
  },
]);
