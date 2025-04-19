import TEXT from "../../util/text"

export default function ButtonLogin(props: any) {
  const {
    isLogin,
    buttonElement,
    avatarElement,
    textElement,
    handleClick,
    avatarUrl,
  } = props;

  return (
    isLogin ? 
    <div className={buttonElement} onClick={handleClick}>
      <p className={textElement}>Thanh</p>
      <figure className={avatarElement}>
        <img src={avatarUrl} alt="" />
      </figure>
    </div> :

    <div className={buttonElement} onClick={handleClick}>
      <p className={textElement}>{TEXT["Header.login"]}</p>
    </div>
  );
}
