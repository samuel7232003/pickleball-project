import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import { useState } from "react";
import { pages } from "../router";

export default function Home(){
  const [curPage, setCurPage] = useState(pages.WELCOME_PAGE);

  return(
    <div>
      <Header curPage={curPage}/>
      <div>
        <Outlet context={{setCurPage}}/>
      </div>
    </div>
  )
}