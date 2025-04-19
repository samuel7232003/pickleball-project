import { useNavigate } from "react-router-dom";

export function ButtonCircleIcon(props: any) {
  const {
    buttonElement,
    buttonElementPre,
    isPrimaryButtons = false,
    iconUrl,
    iconPrimaryUrl,
    navigatePage,
  } = props;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigatePage);
  };

  return isPrimaryButtons ? (
    <figure className={buttonElementPre} onClick={handleClick}>
      <img src={iconPrimaryUrl} alt="icon" />
    </figure>
  ) : (
    <figure className={buttonElement} onClick={handleClick}>
      <img src={iconUrl} alt="icon" />
    </figure>
  );
}
