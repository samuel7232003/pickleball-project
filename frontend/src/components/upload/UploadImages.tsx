import { useRef } from "react";
import { getIcon, getImage, iconsName, imagesName } from "../../util/getAssets";
import text from "../../util/text";
import css from "./UploadImages.module.css";
import classNames from "classnames";
import CarouselBox from "../carousel/CarouselBox";

export default function UploadImages(props: any) {
  const {
    mainElement,
    iconElement,
    icon = getIcon({ nameIcon: iconsName.IMAGE_ADD }),
    contentElement,
    content = text["CreateCourt.upImages"],
    infoElement,
    infoIcon = getIcon({ nameIcon: iconsName.INFO }),
    listImage = [],
    onChange,
    isEdit = true,
  } = props;

  const mainClass = classNames(css.main, mainElement);
  const iconClass = classNames(css.icon, iconElement);
  const contentClass = classNames(css.content, contentElement);
  const infoClass = classNames(css.info, infoElement);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const images = files.map((file, index) => ({
      url: URL.createObjectURL(file),
      order: index + 1,
    }));
    if (onChange) onChange(images);
  };
  
  const listImageDefault = [{_id: "default", url:getImage(imagesName.DEFAULT_IMAGE)}];

  return (
    <>
      {listImage.length > 0 ? (
        <div className={css.carouselWrapper}>
          <CarouselBox listImage={listImage} />
          {isEdit && (
            <figure className={css.iconEdit} onClick={handleUpload}>
              <img src={getIcon({ nameIcon: iconsName.EDIT })} alt="icon" />
            </figure>
          )}
        </div>
      ) : isEdit ? (
        <div className={mainClass} onClick={handleUpload}>
          <figure className={iconClass}>
            <img src={icon} alt="icon" />
          </figure>
          <div className={contentClass}>
            <p>{content}</p>
            <figure className={infoClass}>
              <img src={infoIcon} alt="info" />
            </figure>
          </div>
        </div>
      ) : (
        <div className={css.carouselWrapper}>
          <CarouselBox listImage={listImageDefault} />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFiles}
      />
    </>
  );
}
