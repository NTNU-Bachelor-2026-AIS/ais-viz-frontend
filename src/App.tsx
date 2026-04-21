import { Header } from "@kystverket/styrbord";
import "./App.css";
import { SideBar } from "./Components/SideBar/SideBar";
import ShipInfo, { type ShipInfoProps } from "./Components/ShipInfo/ShipInfo";
import { LibreMap, type VisType } from "./Components/LibreMap";
import { api, getBaseStations } from "./api/posts";
import { useEffect, useState } from "react";
import type { FeatureCollection, Point } from "geojson";
import SettingsBar from "./Components/SettingsBar/SettingsBar";
import { MapControls } from "./Components/MapControls/MapControls";
import { shipInfoContext } from "./Components/ShipInfo/ShipInfoContext";
import { getFilteredAnomalies } from "./api/posts";
import { FilterList } from "./Components/FilterList/FilterList";

/* root component of the app
 */
function App() {
  const [shipInfoProps, setShipInfoProps] = useState<ShipInfoProps | undefined>(
    undefined,
  );

  const [posts, setposts] = useState<FeatureCollection<Point>>({
    type: "FeatureCollection",
    features: [],
  });

  const [baseStations, setBaseStations] = useState<FeatureCollection<Point>>({
    type: "FeatureCollection",
    features: [],
  });

  const shipInfoContextValue = { shipInfoProps, setShipInfoProps };

  useEffect(() => {
    const fetchAnomalyData = async () => {
      try {
        const response = await api.get("/anomaly-groups");
        setposts(response.data);
      } catch (error) {
        console.log(error + " an error occured");
      }
    };
    fetchAnomalyData();
  }, []);

  useEffect(() => {
    const baseStationData = async () => {
      const baseStations = await getBaseStations();
      setBaseStations(baseStations);
    };

    baseStationData();
  }, []);

  const fetchAnomalies = async (filters: any) => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters)
    );
    
    const data = await getFilteredAnomalies(activeFilters);
    if (data) {
      setposts(data);
    }
  }

  useEffect(() => {
    fetchAnomalies({});
  },[]);

  return (
    <>
      <Header
        logo={{
          url: "/",
        }}
      />
      <main className="content-area">
        {/* Map Component */}
        <shipInfoContext.Provider value={{ shipInfoProps, setShipInfoProps }}>
          <LibreMap
            responseData={posts}
            shipInfoContextValue={shipInfoContextValue}
            baseStations={baseStations}
            activeVis={activeVis}
          ></LibreMap>
          {/* Floating components */}
          <FilterList onFilterSubmit={fetchAnomalies} />
          <MapControls 
              activeLayer={activeVis} 
              setActiveLayer={setActiveVis} 
            />
          <ShipInfo />
        </shipInfoContext.Provider>
        {/* <SettingsBar />*/}
        {/*<SideBar responseData={posts} />*/}
      </main>
    </>
  );
}

export default App;
