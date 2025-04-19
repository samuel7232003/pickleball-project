import { useOutletContext } from "react-router-dom"
import css from "./Welcome.module.css"
import { useEffect } from "react";
import { pages } from "../../router";

export function Welcome(){
  const {setCurPage}:any = useOutletContext();

  useEffect(() => {
    setCurPage(pages.WELCOME_PAGE);
  },[])

  return (
    <main className={css.main}>
      <p>Welcome page</p>
    </main>
  )
}