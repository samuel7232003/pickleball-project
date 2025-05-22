import React, { useState, useEffect, useRef } from "react";
import text from "../../util/text";
import FieldSearch from "../fields/FieldSearch";
import css from "./SearchBox.module.css";
import { searchMapbox } from "../../services/mapbox";
import { getIcon, iconsName } from "../../util/getAssets";

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

  } = props;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Feature[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetchSearch(query.trim());
    }, 300);
  }, [query]);

  const handleSelect = (feature: Feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    onAddressSelect(lng, lat);
    setResults([]);
    setQuery(feature.properties.full_address);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  return (
    <div className={css.searchBox}>
      <div className={css.searchBoxTitle}>
        <figure><img src={getIcon({nameIcon: iconsName.MAP})} alt="" /></figure>
        <p>{text["SearchPage.searchTitle"]}</p>
      </div>
      <FieldSearch
        placeholder={placeholder}
        onChange={onChange}
        inputElement={css.inputElement}
        iconElement={css.iconInputElement}
        query={query}
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
