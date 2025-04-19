import { useEffect } from "react"
import { useOutletContext } from "react-router-dom";
import { pages } from "../../router";

export default function NewFeed(){
  const {setCurPage}:any = useOutletContext();
  
  useEffect(() => {
    setCurPage(pages.NEW_FEED_PAGE)
  },[])

  return(
    <main>NewFeed Page</main>
  )
}