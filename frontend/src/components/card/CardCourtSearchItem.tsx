import { useEffect, useState } from "react";
import { getImage, imagesName } from "../../util/getAssets";
import css from "./CardCourtSearchItem.module.css";
import { getImageCourtService } from "../../services/court";

export default function CardCourtSearchItem(props: any) {
  const {  
    court, 
    onClick, 
    cardElement = css.cardElement, 
    inforElement = css.inforElement,
    locationElement = css.locationElement,
  } = props;
  const {_id, name, location, lng, lat, number } = court;
  const [image, setImage] = useState(getImage(imagesName.AVATAR_TEST));

  useEffect(() => {
    const fetchCourt = async () => {
      const response = await getImageCourtService(_id);
      if (response[0]) {
        setImage(response[0].url);
      }
    };
    if (_id) {
      fetchCourt();
    }
  }, [_id]);

  const handleClick = () => {
    onClick(lng, lat);
  }

  return (
    <div className={cardElement} onClick={handleClick}>
      <figure><img src={image} alt="" /></figure>
      <div className={inforElement}>
        <h3>{name}</h3>
        <p className={locationElement}>{location}</p>
      </div>
    </div>
  );
}