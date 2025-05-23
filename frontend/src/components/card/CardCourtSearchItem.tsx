import { getIcon, iconsName } from "../../util/getAssets";
import ButtonTextLink from "../buttons/ButtonTextLink";
import css from "./CardCourtSearchItem.module.css";

export default function CardCourtSearchItem(props: any) {
  const {  
    court, 
    onClick, 
    cardElement = css.cardElement, 
    inforElement = css.inforElement,
    buttonElement = css.buttonElement,
    iconElement = css.iconElement,
    priceElement = css.priceElement,
    addressElement = css.addressElement,
  } = props;
  const { name, address, price, image } = court;

  return (
    <div className={cardElement} onClick={onClick}>
      <figure><img src={image} alt="" /></figure>
      <div className={inforElement}>
        <h3>{name}</h3>
        <p className={addressElement}>{address}</p>
        <p className={priceElement}>{price}</p>
      </div>
      <ButtonTextLink
          buttonElement={buttonElement}
          icon={getIcon({nameIcon: iconsName.ARROW_LINK})}
          iconElement={iconElement}
          handleOnClick={onClick}
        />
    </div>
  );
}