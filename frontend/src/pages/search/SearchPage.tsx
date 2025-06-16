import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { pages } from "../../router";
import css from "./SearchPage.module.css";
import Mapbox from "../../components/mapbox/mapbox";
import text from "../../util/text";

export default function SearchPage() {
  const { setCurPage }: any = useOutletContext();
  
  useEffect(() => {
    setCurPage(pages.SEARCH_PAGE);
  }, []);

  return (
    <main className={css.main}>
      <div className={css.inner}>
        <Mapbox 
          mapMainElement={css.mapMainElement} 
          placeholder={text["SearchPage.searchPlaceholder"]}
        />  
      </div>
    </main>
  );
}

