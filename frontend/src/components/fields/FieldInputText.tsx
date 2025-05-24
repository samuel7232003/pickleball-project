import classNames from "classnames";
import css from "./Field.module.css";
import { getIcon, iconsName } from "../../util/getAssets";
import SearchBox from "../mapbox/SearchBox";

export default function FieldInputText(props: any) {
  const {
    blockElement,
    titleElement,
    title,
    inputElement,
    inputPlaceholder,
    onChange,
    value = "",
    isIconInfo = false,
    iconInfoElement,
    iconInfo = getIcon({ nameIcon: iconsName.INFO }),
    isOneLine = true,
    isAddress = false,
  } = props;

  const iconInfoClass = classNames(css.iconInfo, iconInfoElement);

  return (
    <div className={blockElement}>
      {title && <p className={titleElement}>{title}</p>}
      {isAddress ? (
        <SearchBox
          isTitle={false}
          inputElement={inputElement}
          isIcon={false}
          onAddressSelect={onChange}
        />
      ) : (
        <fieldset className={inputElement}>
          {isOneLine ? (
            <input
              placeholder={inputPlaceholder}
              onChange={onChange}
              value={value}
            />
          ) : (
            <textarea
              placeholder={inputPlaceholder}
              rows={4}
              cols={50}
              onChange={onChange}
              value={value}
            />
          )}
        </fieldset>
      )}
      {isIconInfo && (
        <figure className={iconInfoClass}>
          <img src={iconInfo} alt="info icon" />
        </figure>
      )}
    </div>
  );
}
