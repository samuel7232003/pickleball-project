import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { pages } from "../../router";

export default function LoginPage() {
  const { setCurPage }: any = useOutletContext();
  
  useEffect(() => {
    setCurPage(pages.LOGIN_PAGE_LOGIN);
  }, []);
  
  return <main>Login page</main>;
}
