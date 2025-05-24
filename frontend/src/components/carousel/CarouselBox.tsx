import { Carousel } from "antd";
import css from "./CarouselBox.module.css";

export default function CarouselBox(props: any) {
  const { listImage = [] } = props;

  const listImageShow = listImage.map(({url, order}: any) => {
    // Skip rendering if URL is empty or undefined
    if (!url) return null;
    
    return (
      <div key={order} className={css.slide}>
        <img src={url} alt={`slide-${order}`} loading="lazy" />
      </div>
    );
  }).filter(Boolean); // Remove null items from the array

  return (
    <div className={css.carouselWrapper}>
      <Carousel autoplay arrows className={css.carousel}>
        {listImageShow}
      </Carousel>
    </div>
  );
}
