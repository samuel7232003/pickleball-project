import { Dropdown, MenuProps } from "antd";
import text from "../../util/text";
import { useNavigate } from "react-router-dom";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { useAppSelector } from "../../redux/builder";
import { roles } from "../../common/constants";

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
  const { _id: id, role } = useAppSelector((state: any) => state.user.user);

  const handleClickPersonal = () => {
    if(id){
      navigate(navigateToPage(pages.PERSONAL_PAGE, id));
    }
  }

  const handleClickAdmin = () => {
    if(id){
      navigate(navigateToPage(pages.ADMIN_PAGE));
    }
  }

  const handleClickCreateCourt = () => {
    if(id){
      navigate(navigateToPage(pages.CREATE_COURT_PAGE, "new"));
    }
  }

  const handleClickManage = () => {
    if(id){
      navigate(navigateToPage(pages.MANAGE_PAGE));
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 'account',
      label: text["Header.myAccount"],
      onClick: handleClickPersonal,
      extra: "⌘P",
    },
    {
      key: 'logout',
      label: text["Header.logout"],
      onClick: handleClickLoginReady,
      extra: "⌘Q",
    },
  ];

  const itemsAdmin: MenuProps['items'] = [
    ...items,
    {
      key: 'admin',
      label: text["Header.admin"],
      onClick: handleClickAdmin,
      extra: "⌘A",
    },
  ];

  const itemsOwner: MenuProps['items'] = [
    {
      key: 'createCourt',
      label: text["Header.createCourt"],
      onClick: handleClickCreateCourt,
      extra: "⌘C",
    },
    {
      key: 'manage',
      label: text["Header.manage"],
      onClick: handleClickManage,
      extra: "⌘M",
    },
    ...items,
  ];

  const itemsChoice = role === roles.ADMIN ? itemsAdmin : role === roles.OWNER ? itemsOwner : items;

  return isLogin ? (
    <Dropdown menu={{ items: itemsChoice }}>
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
