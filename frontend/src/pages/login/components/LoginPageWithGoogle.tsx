import { getIcon, getIconValueByKey, iconsName } from "../../../util/getAssets";

export default function LoginPageWithGoogle(props: any) {
  const defaultIcon = getIcon({nameIcon: iconsName.GOOGLE});
  const {
    mainElement,
    googleIconUrl = defaultIcon,
    googleIconElement,
    content,
    contentElement,
  } = props;

  return (
    <div className={mainElement}>
      <figure className={googleIconElement}>
        <img src={googleIconUrl} alt="" />
      </figure>
      <p className={contentElement}>{content}</p>
    </div>
  );
}
