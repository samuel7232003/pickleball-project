import { getIcon, iconsName } from '../../util/getAssets';
import css from './Title.module.css';
import classNames from 'classnames';

export default function Title(props: any) {
  const {
    mainElement,
    iconElement,
    icon,
    title,
    isIconInfo = false,
    iconInfoElement,
    iconInfo = getIcon({ nameIcon: iconsName.INFO_BLACK }),
  } = props;
  const mainClass = classNames(css.main, mainElement);
  const iconClass = classNames(css.icon, iconElement);
  const iconInfoClass = classNames(css.iconInfo, iconInfoElement);
  return (
    <div className={mainClass}>
      <figure className={iconClass}>
        <img src={icon} alt="" />
      </figure>
      <p>{title}</p>
      {isIconInfo && (
        <figure className={iconInfoClass}>
          <img src={iconInfo} alt="info icon" />
        </figure>
      )}
    </div>
  );
}