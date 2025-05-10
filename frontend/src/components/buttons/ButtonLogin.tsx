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

  return isLogin ? (
    <div className={buttonElement} onClick={handleClickLoginReady}>
      <p className={textElement}>{buttonText}</p>
      <figure className={avatarElement}>
        <img src={avatarUrl} alt="" />
      </figure>
    </div>
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
