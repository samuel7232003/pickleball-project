import { Carousel } from "antd";
import { getIcon, iconsName } from "../../util/getAssets";
import text from "../../util/text";
import css from "./UploadImages.module.css";
import classNames from "classnames";

const testData = [
  {order: 1, url: "https://thethaokhoinguyen.com/wp-content/uploads/2024/07/san-Pickleball-tieu-chuan-thi-dau-quoc-te.jpg"},
  {order: 2, url: "https://file.hstatic.net/200000495177/article/dia_chi_san_pickleball_thanh_pho_ho_chi_minh__4df1486fcc43499cb2b9c364e166d923_1024x1024.jpg"},
  {order: 3, url: "https://agasihome.com/wp-content/uploads/2024/10/chieu-sang-san-pickleball-4.jpg"},
  {order: 4, url: "https://alonhaxinh.vn/upload/news/54408133.jpg"},
]

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export default function UploadImages(props: any) {
  const {
    mainElement,
    iconElement,
    icon = getIcon({ nameIcon: iconsName.IMAGE_ADD }),
    contentElement,
    content = text["CreateCourt.upImages"],
    infoElement,
    infoIcon = getIcon({ nameIcon: iconsName.INFO }),
    listImage = [...testData],
  } = props;

  const mainClass = classNames(css.main, mainElement);
  const iconClass = classNames(css.icon, iconElement);
  const contentClass = classNames(css.content, contentElement);
  const infoClass = classNames(css.info, infoElement);

  const isFill = listImage.length > 0;

  const listImageShow = listImage.map( (image:any) => {
    const {url, order} = image;
    return (
      <div key={order} className={css.carousel_}>
        <img src={url} alt="" />
      </div>
    )
  });

  return (
    <div className={mainClass}>
      {true ? (
        <Carousel >
          <div>
        <h3 style={contentStyle}>1</h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
        </Carousel>
      ) : (
        <>
          <figure className={iconClass}>
            <img src={icon} alt="" />
          </figure>
          <div className={contentClass}>
            <p>{content}</p>
            <figure className={infoClass}>
              <img src={infoIcon} alt="" />
            </figure>
          </div>
        </>
      )}
    </div>
  );
}
