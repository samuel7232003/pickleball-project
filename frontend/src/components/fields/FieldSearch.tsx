
import { getIcon, iconsName } from "../../util/getAssets";

export default function FieldSearch(props: any) {
  const {
    placeholder = "Type to search...",
    onChange,
    inputElement,
    iconElement,
    icon = getIcon({ nameIcon: iconsName.SEARCH_GRAY}),
    query = "",
  } = props;

  return (
    <div className={inputElement}>
      <figure className={iconElement}><img src={icon} alt="" /></figure>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={onChange}
      />
    </div>
  );
}