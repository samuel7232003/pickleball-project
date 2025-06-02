import React, { useState, useEffect } from "react";
import text from "../../util/text";
import FieldSearch from "../fields/FieldSearch";
import css from "./SearchBox.module.css";
import { searchMapbox } from "../../services/mapbox";
import { getIcon, iconsName } from "../../util/getAssets";
import { searchCourtsService } from "../../services/court";
import CardCourtSearchItem from "../card/CardCourtSearchItem";

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
    isSearchOnMap = true,
    handleCourtSelect,
    value ="",
  } = props;

  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Feature[]>([]);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    setQuery(value);
    setIsInit(true);
  }, [value]);

  const fetchSearch = async (text: string) => {
    const search = async () => {
      const data = await searchMapbox(text);
      if (data.length > 0) {
        setResults(data);
      } else {
        setResults([]);
      }
    };
    const searchOnData = async () => {
      const data = await searchCourtsService(text);
      if (data.length > 0) {
        setResults(data);
      } else {
        setResults([]);
      }
    };
    if (query.trim() !== "") {
      if (isSearchOnMap) {
        search();
      } else {
        searchOnData();
      }
    }
  };

  useEffect(() => {
    if (query.trim().length === 0 || isInit) {
      setResults([]);
      setIsInit(false); 
      return;
    }

    fetchSearch(query.trim());
  }, [query]);

  const handleSelect = (feature: Feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const address = feature.properties.full_address;
    onAddressSelect({ lng, lat, address });
    setResults([]);
    setQuery(address);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setResults([]);
    }, 150);
  };

  const ListCourtSearchItem = () => {
    return (
      <div className={css.listResult}>
        {results.map((item: any, idx: number) => (
          <CardCourtSearchItem
            key={idx}
            court={item}
            onClick={handleCourtSelect}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={inputElement ? undefined : css.searchBox}>
      {isTitle && (
        <div className={css.searchBoxTitle}>
          <figure>
            <img src={getIcon({ nameIcon: iconsName.MAP })} alt="" />
          </figure>
          <p>{text["SearchPage.searchTitle"]}</p>
        </div>
      )}
      <FieldSearch
        placeholder={placeholder}
        onChange={onChange}
        inputElement={inputElement ? inputElement : css.inputElement}
        iconElement={css.iconInputElement}
        query={query}
        isIcon={isIcon}
        onBlur={handleBlur}
      />
      {results.length > 0 && isSearchOnMap && (
        <ul className={css.listResult}>
          {results.map((feature, idx) => (
            <li key={idx} onClick={() => handleSelect(feature)}>
              {feature.properties.full_address}
            </li>
          ))}
        </ul>
      )}
      {results.length > 0 && !isSearchOnMap && <ListCourtSearchItem />}
    </div>
  );
};

export default SearchBox;
