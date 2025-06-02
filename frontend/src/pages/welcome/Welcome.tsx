import { useNavigate, useOutletContext } from "react-router-dom";
import css from "./Welcome.module.css";
import { useEffect } from "react";
import { pages } from "../../router";
import WelcomePanel from "./WelcomePanel";
import { getIcon, getImage, iconsName, imagesName } from "../../util/getAssets";
import ButtonTextLink from "../../components/buttons/ButtonTextLink";
import text from "../../util/text";
import navigateToPage from "../../config/navigate";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../redux/builder";
import { roles } from "../../common/constants";

export function Welcome() {
  const { setCurPage }: any = useOutletContext();
  const { role } = useAppSelector((state: any) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    setCurPage(pages.WELCOME_PAGE);
  }, []);

  function handleButtonClick() {
    if(role===roles.OWNER) navigate(navigateToPage(pages.CREATE_COURT_PAGE, ""));
    else navigate(navigateToPage(pages.SEARCH_PAGE)); 
  }

  const ListImage = () => {
    return(
      <div className={css.listImage}>
        <figure><img src={getImage(imagesName.WELCOME1)} alt="" /></figure>
        <figure><img src={getImage(imagesName.WELCOME2)} alt="" /></figure>
        <figure><img src={getImage(imagesName.WELCOME3)} alt="" /></figure>
      </div>
    )
  }

  return (
    <main className={css.main}>
      <div className={css.mainInner}>
        <WelcomePanel
          panelElement={css.panel}
          panelTitleElement={css.panelTitle}
          panelContentElement={css.panelContent}
          panelIconElement={css.panelIcon}
          panelIcon={getIcon({ nameIcon: iconsName.CHECK })}
        />
        <ButtonTextLink
          buttonElement={css.buttonLink}
          content={role ? text[`Welcome.${role}.buttonContent` as keyof typeof text] : text["Welcome.buttonContent"]}
          contentElement={css.buttonContent}
          icon={getIcon({ nameIcon: iconsName.ARROW_LINK })}
          iconElement={css.buttonIcon}
          handleOnClick={handleButtonClick}
        />
        <ListImage/>
      </div>
    </main>
  );
}
