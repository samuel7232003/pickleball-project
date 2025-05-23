export default function ButtonTextLink(props: any) {
  const {
    buttonElement,
    content = "",
    contentElement,
    icon,
    iconElement,
    handleOnClick,
  } = props;
  
  return (
    <div className={buttonElement} onClick={handleOnClick}>
      {content && <p className={contentElement}>{content}</p>}
      <figure className={iconElement}>
        <img src={icon} alt="" />
      </figure>
    </div>
  );
}
