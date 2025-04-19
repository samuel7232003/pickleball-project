import feed from "../assets/icons/mail-05.png";
import feedPre from "../assets/icons/mail-05 (1).png";
import home from "../assets/icons/Home_light (1).png";
import homePre from "../assets/icons/Home_light.png";
import search from "../assets/icons/search-02.png";
import searchPre from "../assets/icons/search-02 (1).png";
import background from "../assets/images/background.png";
import avatar_test from "../assets/images/avatar_test.png";
import { tagsDefault } from "../constants/common";

// <<<<<<<<<< icon >>>>>>>>>>>>>>

export const iconsName = { ...tagsDefault } as const;

type IconName = (typeof iconsName)[keyof typeof iconsName];

interface GetIconProps {
  nameIcon: IconName;
  isPre?: boolean;
}

const iconMap: Record<IconName, string> = {
  feed,
  home,
  search,
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
} as const;

type ImageKey = typeof imagesName[keyof typeof imagesName];

const imageMap: Record<ImageKey, string> = {
  background,
  avatar_test,
};

export function getImage(nameImage: ImageKey): string {
  return imageMap[nameImage];
}