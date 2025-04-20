import feed from "../assets/icons/mail-05.png";
import feedPre from "../assets/icons/mail-05 (1).png";
import home from "../assets/icons/Home_light (1).png";
import homePre from "../assets/icons/Home_light.png";
import search from "../assets/icons/search-02.png";
import searchPre from "../assets/icons/search-02 (1).png";
import check from "../assets/icons/check-broken.png";
import arrowLink from "../assets/icons/arrow-up-right.png"
import background from "../assets/images/background.png";
import avatar_test from "../assets/images/avatar_test.png";
import welcome_1 from "../assets/images/welcome1.png";
import welcome_2 from "../assets/images/welcome2.png";
import welcome_3 from "../assets/images/welcome3.png";
import { tagsDefault } from "../constants/common";

// <<<<<<<<<< icon >>>>>>>>>>>>>>

export const iconsName = { 
  ...tagsDefault,
  CHECK: "check",
  ARROW_LINK: "arrowLink",
} as const;

type IconName = (typeof iconsName)[keyof typeof iconsName];

interface GetIconProps {
  nameIcon: IconName;
  isPre?: boolean;
}

const iconMap: Record<IconName, string> = {
  feed,
  home,
  search,
  check,
  arrowLink,
};

const iconPreMap: Record<IconName, string> = {
  feed: feedPre,
  home: homePre,
  search: searchPre,
};

export function getIcon({ nameIcon, isPre = false }: GetIconProps): string {
  const defaultIcon = home;
  if (!nameIcon || !(nameIcon in iconMap)) return defaultIcon;

  return isPre ? iconPreMap[nameIcon] : iconMap[nameIcon];
}

type IconsNameKey = keyof typeof iconsName;
type GetIconsNameKeyProps = {
  key: IconsNameKey;
  isPre?: boolean;
};

export function getIconValueByKey(props: GetIconsNameKeyProps) {
  const { key, isPre = false } = props;
  return getIcon({ nameIcon: iconsName[key], isPre: isPre });
}

// <<<<<<<<<< images >>>>>>>>>>>>>>

export const imagesName = {
  BACKGROUND: "background",
  AVATAR_TEST: "avatar_test",
  WELCOME1: "welcome_1",
  WELCOME2: "welcome_2",
  WELCOME3: "welcome_3",
} as const;

type ImageKey = typeof imagesName[keyof typeof imagesName];

const imageMap: Record<ImageKey, string> = {
  background,
  avatar_test,
  welcome_1,
  welcome_2,
  welcome_3,
};

export function getImage(nameImage: ImageKey): string {
  return imageMap[nameImage];
}