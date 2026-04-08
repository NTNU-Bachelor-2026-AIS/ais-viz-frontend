import { Header } from "@kystverket/styrbord";
import "./App.css";
import { SideBar } from "./Components/SideBar/SideBar";
import ShipInfo, { type ShipInfoProps } from "./Components/ShipInfo/ShipInfo";
import { LibreMap, type VisType } from "./Components/LibreMap";
import { api, getMMSI } from "./api/posts";
import { useEffect, useState } from "react";
import type { FeatureCollection, Point } from "geojson";
import SettingsBar from "./Components/SettingsBar/SettingsBar";
import { MapControls } from "./Components/MapControls/MapControls";
import { shipInfoContext } from "./Components/ShipInfo/ShipInfoContext";

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
  const [activeVis, setActiveVis] = useState<VisType>("clustering");

  const shipInfoContextValue = { shipInfoProps, setShipInfoProps };

  useEffect(() => {
    const data = async () => {
      try {
        const response = await api.get("/anomaly-groups");
        setposts(response.data);
      } catch (error) {
        console.log(error + " an error occured");
      }
    };
    data();
  }, []);

  useEffect(() => {
    console.log("here is updated posts", posts);

    console.log(getMMSI("3195482") + " heherererer");
  }, [posts]);

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
          ></LibreMap>
          {/* Floating components */}
          <ShipInfo />
        </shipInfoContext.Provider>
        {/* <SettingsBar />*/}
        <SideBar responseData={posts} />
      </main>
    </>
  );
}

export default App;
