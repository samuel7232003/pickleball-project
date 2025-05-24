import React, { useState, useEffect, useRef } from "react";
import text from "../../util/text";
import FieldSearch from "../fields/FieldSearch";
import css from "./SearchBox.module.css";
import { searchMapbox } from "../../services/mapbox";
import { getIcon, iconsName } from "../../util/getAssets";
import classNames from "classnames";

type Feature = {
  properties: {
    full_address: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

const SearchBox = (props: any) => {
  const { 
    onAddressSelect, 
    placeholder = "Type to search...",
    isTitle = true,
    inputElement,
    isIcon = true,
  } = props;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Feature[]>([]);

  const fetchSearch = async (text: string) => {
    const search = async () => {
      const data = await searchMapbox(text);
      if (data.length > 0) {
        setResults(data);
      } else {
        setResults([]);
      }
    };
    if (query.trim() !== "") search();
  };

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    fetchSearch(query.trim());
  }, [query]);

  const handleSelect = (feature: Feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const address = feature.properties.full_address;
    onAddressSelect({lng, lat, address});
    setResults([]);
    setQuery(address);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  const handleBlur = () => {
    setTimeout(() => {
      setResults([]);
    }, 150);
  }

  return (
    <div className={inputElement ? undefined : css.searchBox}>
      {isTitle && <div className={css.searchBoxTitle}>
        <figure><img src={getIcon({nameIcon: iconsName.MAP})} alt="" /></figure>
        <p>{text["SearchPage.searchTitle"]}</p>
      </div>}
      <FieldSearch
        placeholder={placeholder}
        onChange={onChange}
        inputElement={inputElement ? inputElement : css.inputElement}
        iconElement={css.iconInputElement}
        query={query}
        isIcon={isIcon}
        onBlur={handleBlur}
      />
      {results.length > 0 && (
        <ul className={css.listResult}>
          {results.map((feature, idx) => (
            <li key={idx} onClick={() => handleSelect(feature)}>
              {feature.properties.full_address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
