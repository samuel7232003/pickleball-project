import { useRef } from "react";
import { getIcon, getImage, iconsName, imagesName } from "../../util/getAssets";
import text from "../../util/text";
import css from "./UploadImageAvatar.module.css";
import classNames from "classnames";

export default function UploadImageAvatar(props: any) {
  const {
    mainElement,
    iconElement,
    icon = getIcon({ nameIcon: iconsName.IMAGE_ADD }),
    contentElement,
    content = text["PersonalPage.uploadAvatar"],
    infoElement,
    infoIcon = getIcon({ nameIcon: iconsName.INFO }),
    image,
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (onChange) onChange(imageUrl);
    }
  };

  const defaultImage = getImage(imagesName.DEFAULT_IMAGE);

  return (
    <>
      {image ? (
        <div className={css.avatarWrapper}>
          <img src={image} alt="avatar" className={css.avatar} />
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
        <div className={css.avatarWrapper}>
          <img src={defaultImage} alt="avatar" className={css.avatar} />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFile}
      />
    </>
  );
}
