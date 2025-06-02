import { Dropdown, MenuProps } from "antd";
import text from "../../util/text";
import { useNavigate } from "react-router-dom";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { useAppSelector } from "../../redux/builder";

export default function ButtonLogin(props: any) {
  const {
    isLogin,
    buttonElement,
    buttonElementPre,
    avatarElement,
    textElement,
    handleClick,
    handleClickLoginReady,
    avatarUrl,
    isPrimaryButton = false,
    buttonText,
  } = props;

  const navigate = useNavigate();
  const { _id: id } = useAppSelector((state: any) => state.user.user);

  const handleClickPersonal = () => {
    if(id){
      navigate(navigateToPage(pages.PERSONAL_PAGE, id));
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 'account',
      label: text["Header.myAccount"],
      onClick: handleClickPersonal,
    },
    {
      key: 'logout',
      label: text["Header.logout"],
      onClick: handleClickLoginReady,
    },
  ];

  return isLogin ? (
    <Dropdown menu={{ items }}>
      <div className={buttonElement}>
        <p className={textElement}>{buttonText}</p>
        <figure className={avatarElement}>
          <img src={avatarUrl} alt="" />
        </figure>
      </div>
    </Dropdown>
  ) : isPrimaryButton ? (
    <div className={buttonElementPre} onClick={handleClick}>
      <p className={textElement}>{buttonText}</p>
    </div>
  ) : (
    <div className={buttonElement} onClick={handleClick}>
      <p className={textElement}>{buttonText}</p>
    </div>
  );
}
