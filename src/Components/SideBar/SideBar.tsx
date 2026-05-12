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
import { getAnomalyGroupByMMSI, getTypeFromString } from "../../api/posts";
import { debounce } from "lodash";
import { FixedSizeList as List } from "react-window";
import type { ListChildComponentProps } from "react-window";

/*
 Sidebar of the app that can search for various anomaly groups. 
*/

//props for sidebar containing responsedata as featurecollection.
interface sideBarProps {
  responseData: FeatureCollection<Point>;
}

type SearchType = "ANOMALYTYPE" | "MMSI";

// sidebare component that can filter and change based on used input.
export const SideBar = ({ responseData }: sideBarProps) => {
  const [query, setquery] = useState("");
  const [anomaly, setAnomaly] = useState<Feature<
    Point,
    GeoJsonProperties
  > | null>(null);

  const [filterList, setFilterList] = useState<FeatureCollection<Point>>();
  const [dropDownSelect, setDropDownSelect] =
    useState<SearchType>("ANOMALYTYPE");

  //useeffect that changes list in sidebar based on responsedata changing.
  useEffect(() => {
    if (responseData.features.length != null) {
      setFilterList(responseData);
    }
  }, [responseData]);

  // method that hanldes search asynchronously, checks the dropdown selected by user and changes based on search string.
  const handleSearch = async (searchString: string) => {
    let posts: FeatureCollection<Point, GeoJsonProperties> | undefined;
    if (searchString === "" && filterList != responseData) {
      setFilterList(responseData);
    } else {
      if (dropDownSelect == "ANOMALYTYPE") {
        posts = await getTypeFromString(searchString);
      }

      if (dropDownSelect == "MMSI") {
        posts = await getAnomalyGroupByMMSI(searchString);
      }
      if (Array.isArray(posts?.features) && posts.features.length > 0) {
        setFilterList(posts);
      }
    }
  };

  //debounces the search, currently by 2 seconds.
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 2000), [
    responseData,
    dropDownSelect,
  ]);

  // hanldes itemclick by setting anomaly to e.
  const handleItemClick = (e: Feature<Point, GeoJsonProperties> | null) => {
    setAnomaly(e);
  };

  const Row = ({
    index,
    style,
    data,
  }: ListChildComponentProps<Feature<Point, GeoJsonProperties>[]>) => {
    const feature = data[index];
    return (
      <div
        style={style}
        className="boat-item"
        //  onClick={() => handleItemClick(feature)}
      >
        <span className="boat-id">ID : {feature.properties?.id},</span>
        {/* 
        <span className="boat-mmsi"> MMSI: {feature.properties?.mmsi}</span>
        <span className="anomaly-type"> : {feature.properties?.type}</span>
        */}
        {feature.properties?.id ? (
          <SideBarListItemDetails feature={feature} />
        ) : null}{" "}
        {/*  //
      https://stackoverflow.com/questions/62517789/how-to-render-a-component-on-click-on-list-item-to-show-its-detail
      here is code its based on. */}
      </div>
    );
  };

  //sidebar with search container.
  return (

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
      <List
        height={window.innerHeight - 140}
        width="100%"
        itemSize={200}
        itemCount={filterList?.features.length ?? 0}
        itemData={filterList?.features ?? []}
      >
        {Row}
      </List>
    </aside>
  );
};
