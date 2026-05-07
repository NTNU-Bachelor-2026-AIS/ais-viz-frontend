import React, { useCallback, useEffect, useState } from "react";
import "./SideBar.css";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import type { Point } from "geojson";
import { SideBarListItemDetails } from "./SideBarListItemDetails";
import { getMMSI, getTypeFromString } from "../../api/posts";
import { debounce } from "lodash";

interface sideBarProps {
  responseData: FeatureCollection<Point>;
}

type SearchType = "ANOMALYTYPE" | "MMSI";

export const SideBar = ({ responseData }: sideBarProps) => {
  const [query, setquery] = useState("");
  const [anomaly, setAnomaly] = useState<Feature<
    Point,
    GeoJsonProperties
  > | null>(null);

  const [filterList, setFilterList] = useState<FeatureCollection<Point>>();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [dropDownSelect, setDropDownSelect] =
    useState<SearchType>("ANOMALYTYPE");

  useEffect(() => {
    if (responseData.features.length != null) {
      setFilterList(responseData);
    }
  }, [responseData]);

  const handleSearch = async (searchString: string) => {
    let posts: FeatureCollection<Point, GeoJsonProperties> | undefined;
    if (searchString === "" && filterList != responseData) {
      setFilterList(responseData);
    } else {
      if (dropDownSelect == "ANOMALYTYPE") {
        posts = await getTypeFromString(searchString);
      }

      if (dropDownSelect == "MMSI") {
        posts = await getMMSI(searchString);
      }
      if (Array.isArray(posts?.features) && posts.features.length > 0) {
        setFilterList(posts);
      }
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 2000), [
    responseData,
    dropDownSelect,
  ]);

  const handleItemClick = (e: Feature<Point, GeoJsonProperties> | null) => {
    setAnomaly(e);
  };

  return (

    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      {/* Using props as classname it can have two css styles */}
      {/* Not used because of time restraints */}
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
      </div>
    <aside className="boat-sidebar">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder={"Search boat by " + dropDownSelect?.toLocaleLowerCase()}
          className="sidebar-search"
          value={query}
          onChange={(e) => {
            setquery(e.target.value);
            debouncedHandleSearch(e.target.value);
          }}
        />
      </div>
      <div className="sidebar-dropdown">
        <div>Choose what to search by</div>
        <select
          value={dropDownSelect}
          onChange={(e) => setDropDownSelect(e.target.value as SearchType)}
        >
          <option value="ANOMALYTYPE">anomalyType</option>
          <option value="MMSI">mmsi</option>
        </select>
      </div>

      {/* Scrollable Content Section */}
      <div className="list-container">
        {filterList &&
          filterList.features.length > 0 &&
          filterList?.features.map((feature) => (
            <div
              key={feature.properties?.id}
              className="boat-item"
              onClick={() => handleItemClick(feature)}
            >
              <span className="boat-id">ID : {feature.properties?.id},</span>
              <span className="boat-mmsi">
                {" "}
                MMSI: {feature.properties?.mmsi}
              </span>
              <span className="anomaly-type">
                {" "}
                : {feature.properties?.type}
              </span>
              {anomaly === feature ? (
                <SideBarListItemDetails feature={feature} />
              ) : null}{" "}
              {/*  //
              https://stackoverflow.com/questions/62517789/how-to-render-a-component-on-click-on-list-item-to-show-its-detail
              here is code its based on. */}
            </div>
          ))}
      </div>
    </aside>
    </div>
  );
};
