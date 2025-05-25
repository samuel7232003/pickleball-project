import { Dropdown, MenuProps } from "antd";
import text from "../../util/text";

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

  const items: MenuProps['items'] = [
    {
      key: 'account',
      label: text["Header.myAccount"],
      disabled: true,
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
